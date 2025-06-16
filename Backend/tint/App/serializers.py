
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'product_id',
            'product_name',
            'image',
            'amount',
            'mrp',
            'gender',
            'available_sizes',
            'category',
        ]
        
    def to_representation(self, instance):
        """
        Override the default representation to handle the image URL
        """
        representation = super().to_representation(instance)
        if instance.image:
            if representation['image'].startswith('/media/'):
                # If image starts with /media/, no changes needed
                pass
            else:
                # Otherwise, prepend the media URL
                representation['image'] = '/media/' + representation['image']
        return representation
