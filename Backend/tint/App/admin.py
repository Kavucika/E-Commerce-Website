from django.contrib import admin
from .models import Product

# Custom admin to show all fields including gender
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_filter = ('gender', 'category')  # 👈 optional: filter sidebar by category too
    search_fields = ('product_name', 'category')  # 👈 optional: searchable by category too
    fields = ('product_name', 'image', 'amount', 'mrp', 'gender', 'available_sizes', 'category')
    list_display = ('product_id', 'product_name', 'amount', 'mrp', 'gender', 'category')
