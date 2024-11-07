from django.urls import path
from . import views

urlpatterns = [
    path('products', views.products, name='products'),
    path('product_detail/<slug:slug>', views.product_detail, name='product_detail'),
    path('add_item/', views.add_item,name='add_item'),
    path('product_in_cart',views.product_in_cart,name='product_in_cart'),
    path('get_cart_stat',views.get_cart_stat,name='get_cart_stat'),
    path('get_cart',views.get_cart,name='get_cart'),
    path('update_quantity/',views.update_quantity,name='update_quantity'),
    path('delete_cartitem/',views.delete_cartitem,name='delete_cartitem'),
    path('user_info/',views.user_info,name='user_info'),
    path('register_user/', views.register_user, name='register_user'),
    path('merge_user_cart_to_local/', views.merge_user_cart_to_local, name='merge_user_cart_to_local'),
    path('merge_local_cart/', views.merge_local_cart, name='merge_local_cart'),
    path('initiate_payu_payment/', views.initiate_payu_payment, name='initiate_payu_payment'),
    path('payu_payment_callback/', views.payu_payment_callback, name='payu_payment_callback'),
    # path('initiate_payment/', views.initiate_payment, name='initiate_payment'),
]