from rest_framework import serializers
from .models import Product, Cart, CartItem
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','slug','image','description','category','price']


class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','name','slug','image','description','category','price','similar_products']
        
    def get_similar_products(sef,product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        serializers = ProductSerializer(products, many=True)
        return serializers.data 
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id','quantity','product','total']
        
    def get_total(self,cartitem):
        price = cartitem.product.price * cartitem.quantity
        return price
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only = True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id','cart_code','items','sum_total','num_of_items','created_at','modified_at']
    
    def get_sum_total(self,cart):
        items = cart.items.all()
        total = sum([item.product.price*item.quantity for item in items])
        return total
    
    def get_num_of_items(self,cart):
        items = cart.items.all()
        total = sum([item.quantity for item in items])
        return total

        
class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id','cart_code','num_of_items']
        
    def get_num_of_items(self,cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items
         
         
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username','first_name','last_name','email','city','state','address','phone']
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'password2', 'first_name', 'last_name', 'email', 'city', 'state', 'address', 'phone']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = get_user_model().objects.create_user(**validated_data)
        return user