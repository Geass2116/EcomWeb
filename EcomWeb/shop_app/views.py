from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import Product, Cart, CartItem, Transaction
from .serializers import ProductSerializer,DetailedProductSerializer,CartItemSerializer,SimpleCartSerializer,CartSerializer,UserSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from decimal import Decimal, ROUND_DOWN
import hashlib
import uuid
from django.urls import reverse
from django.http import JsonResponse


BASE_URL = 'http://localhost:5173'

@api_view(["GET"])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many = True)
    return Response(serializer.data)

@api_view(["GET"])
def product_detail(request,slug):
    product = Product.objects.get(slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

@api_view(["POST"])
def add_item(request):
    try:
        cart_code = request.data.get('cart_code')
        product_id = request.data.get('product_id')
        
        if not cart_code:
            return Response({'error': 'Cart code is required'}, status=400)
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=400)
        
        cart, created = Cart.objects.get_or_create(cart_code = cart_code)
        product = Product.objects.get(id = product_id)
        
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product = product)
        cartitem.quantity = 1
        cartitem.save()
        
        serializer = CartItemSerializer(cartitem)
        return Response({ 'data':serializer.data,'message':'CartItem created successfully' }, status=201)
    except Exception as e:
        return Response({'error':str(e)},status=400)


@api_view(["GET"])
def product_in_cart(request):
    try:
        cart_code = request.query_params.get('cart_code')
        product_id = request.query_params.get('product_id')
        try:
            cart = Cart.objects.get(cart_code=cart_code)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=200)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        cart_item = CartItem.objects.filter(cart=cart, product=product).exists()
        return Response({'product_in_cart': cart_item}, status=200)
    except Exception as e:
            return Response({"error":"not able to do anything"},status=501)
    
@api_view(['GET'])
def get_cart_stat(request):
    cart_code = request.query_params.get('cart_code')
    
    if not cart_code:
        return Response({"message": "Cart code is required"}, status=400)

    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
        serializer = SimpleCartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({"message": "Cart Not Found"}, status=200)


@api_view(['GET'])
def get_cart(request):
    try:
        cart_code = request.query_params.get('cart_code')
        cart = Cart.objects.get(cart_code=cart_code, paid = False)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({"message": "Cart Not Found"}, status=200)

@api_view(['POST'])
def merge_user_cart_to_local(request):

    cart_code = request.data.get('cart_code')
    user = request.user if request.user.is_authenticated else None

    if not user:
        return Response({
            "success": False,
            "message": "User not authenticated."
        }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        
        user_cart = Cart.objects.get(user=user, paid=False)
        local_cart, created = Cart.objects.get_or_create(cart_code=cart_code, paid=False)
        print(local_cart)
        for item in user_cart.items.all():
            local_cart_item, created = CartItem.objects.get_or_create(cart=local_cart, product=item.product)
            local_cart_item.quantity = item.quantity

            local_cart_item.save()
        serializer = CartSerializer(local_cart).data

        return Response(serializer, status=status.HTTP_200_OK)

    except Cart.DoesNotExist:
        return Response({
            "success": False,
            "message": "User cart not found."
        }, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({
            "success": False,
            "message": "Product not found."
        }, status=status.HTTP_404_NOT_FOUND)
        
        
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def merge_local_cart(request):
    user = request.user
    cart_code = request.data.get("cart_code", "")

    if not user.is_authenticated:
        return Response({"error": "User must be logged in"}, status=403)
    
    try:
        user_cart, _ = Cart.objects.get_or_create(user=user, paid=False)
        local_cart = Cart.objects.get(cart_code=cart_code, paid=False)
        user_cart.items.all().delete()

        for item in local_cart.items.all():
            CartItem.objects.create(
                cart=user_cart,
                product=item.product,
                quantity=item.quantity
            )
        # local_cart.delete()
        
        cart_data = CartSerializer(user_cart).data
        return Response(cart_data, status=200)

    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=404)


@api_view(['PATCH'])
def update_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        quantity = int(quantity)
        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()
        serializer = CartItemSerializer(cartitem)
        return Response({ "data": serializer.data, "message": "Cartitem updated successfully!"})
    except Exception as e:
        return Response({'error':str(e)}, status=400)
    
@api_view(['POST'])
def delete_cartitem(request):
    cartitem_id = request.data.get('item_id')
    cartitem = CartItem.objects.get(id=cartitem_id)
    cartitem.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)








def generate_payu_hash(key, txnid, amount, productinfo, firstname, email, salt):
    hash_sequence = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|||||||||||{salt}"
    
    hash_object = hashlib.sha512(hash_sequence.encode())
    hash_value = hash_object.hexdigest()
    return hash_value





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payu_payment(request):
    
    tx_ref = str(uuid.uuid4()) 
    user = request.user
    cart_code = request.data.get('cart_code')

    try:
        cart = Cart.objects.get(cart_code=cart_code)
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart not found'}, status=404)

    amount = sum(item.product.price * item.quantity for item in cart.items.all())
    tax = Decimal(amount * Decimal("0.05")).quantize(Decimal("0.00"), rounding=ROUND_DOWN)
    total_amount = Decimal(amount+tax).quantize(Decimal("0.00"), rounding=ROUND_DOWN)  

    success_url = request.build_absolute_uri(f'{BASE_URL}/payment_success/')  
    failure_url = request.build_absolute_uri(f'{BASE_URL}/payment_failure/')  

    hash_value = generate_payu_hash(settings.PAYU_MERCHANT_KEY,tx_ref,str(total_amount),'Cart Payment', user.first_name,user.email,settings.PAYU_MERCHANT_SALT)


    
    order_data = {
        'key': settings.PAYU_MERCHANT_KEY,
        'txnid': tx_ref,
        'amount': str(total_amount),  
        'productinfo': 'Cart Payment',
        'firstname': user.first_name,
        'email': user.email,
        'phone': user.phone,
        'surl': success_url,
        'furl': failure_url,
        'service_provider': 'payu_paisa',
        'hash': hash_value
    }
    print("Order data sent to PayU:", order_data)

    
    print("Order data for PayU:", order_data)

    
    payment_url = 'https://test.payu.in/_payment'  
    return JsonResponse({'payment_url': payment_url, 'order_data': order_data})  



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payu_payment_callback(request):
    data = request.data
    payu_status = data.get("status")
    txnid = data.get("txnid")
    amount = data.get("amount")
    hash_received = data.get("hash")
    
    
    try:
        transaction = Transaction.objects.get(ref=txnid, amount=Decimal(amount), status='pending')
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found or already completed'}, status=404)

    
    hash_sequence = f"{settings.PAYU_MERCHANT_SALT}|{payu_status}|{txnid}|{amount}|{transaction.user.first_name}|{transaction.user.email}|||||||||||{settings.PAYU_MERCHANT_KEY}"
    hash_calculated = hashlib.sha512(hash_sequence.encode('utf-8')).hexdigest()

    if hash_calculated != hash_received:
        return Response({'error': 'Invalid signature'}, status=400)

    if payu_status == "success":
        transaction.status = 'completed'
        transaction.save()
        
        cart = transaction.cart
        cart.paid = True
        cart.user = transaction.user
        cart.save()
        
        return Response({'message': 'Payment successful!'})

    transaction.status = 'failed'
    transaction.save()

    return Response({'error': 'Payment failed'})
