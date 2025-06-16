from django.shortcuts import render
from django.http import JsonResponse
from .models import Product
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ProductSerializer
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Order
from rest_framework.permissions import IsAuthenticated

# Create your views here.
@api_view(['GET'])
def get_user_orders(request):
    if request.user.is_authenticated:
        orders = Order.objects.filter(user=request.user).order_by('-order_date')
        data = [
            {
                "product_name": order.product_name,
                "quantity": order.quantity,
                "order_date": order.order_date.strftime("%Y-%m-%d %H:%M"),
                "status": order.status,
            }
            for order in orders
        ]
        return Response(data)
    else:
        return Response({'error': 'Unauthorized'}, status=401)

@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@csrf_exempt
@require_http_methods(["DELETE"])
def product_delete(request, product_id):
    try:
        product = Product.objects.get(product_id=product_id)
        product.delete()
        return JsonResponse({'success': True, 'message': 'Product deleted'})
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    # Process each product to include available_sizes as a list
    data = []
    for product in products:
        product_data = ProductSerializer(product).data
        # Add the available sizes as a list instead of a comma-separated string
        product_data['available_sizes'] = product.get_available_sizes()
        data.append(product_data)
    return Response(data)

@api_view(['GET'])
def get_product_detail(request, pk):
    try:
        product = Product.objects.get(product_id=pk)
        product_data = ProductSerializer(product).data
        # Add the available sizes as a list
        product_data['available_sizes'] = product.get_available_sizes()
        return Response(product_data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    
@api_view(['POST'])
@csrf_exempt
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'email': user.email  # ✅ Added line to include email
        })
    else:
        return Response({'error': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@csrf_exempt
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
