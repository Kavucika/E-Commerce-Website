# Generated by Django 5.2.3 on 2025-06-16 06:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0007_product_mrp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='product_name',
        ),
        migrations.AddField(
            model_name='order',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='App.product'),
        ),
    ]
