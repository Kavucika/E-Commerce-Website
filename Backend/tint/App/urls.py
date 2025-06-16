from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='product_list'),
    path('products/<int:product_id>/delete/', views.product_delete, name='product_delete'),
    path('orders/', views.get_user_orders, name='get_user_orders'), 
]