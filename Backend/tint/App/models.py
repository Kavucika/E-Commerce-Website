from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='product_images/')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('U', 'Unisex'),
        ('N', 'Not Specified'),
        ('K', 'Kids'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    
    # Available size choices
    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double Extra Large'),
    ]
    # You can store multiple sizes as a comma-separated string
    available_sizes = models.CharField(max_length=50, default='M,L,XL')
    category = models.CharField(max_length=100, default='General')  
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def get_available_sizes(self):
        """Return list of available sizes"""
        return self.available_sizes.split(',')

    def __str__(self):
        return self.product_name
    

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)  # ✅ link to product
    quantity = models.PositiveIntegerField(default=1)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Processing")

    def __str__(self):
        return f"{self.user.username} - {self.product.product_name if self.product else 'Unknown'} ({self.status})"
