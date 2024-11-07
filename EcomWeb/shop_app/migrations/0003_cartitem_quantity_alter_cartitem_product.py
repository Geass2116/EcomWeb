# Generated by Django 5.1.2 on 2024-10-24 23:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0002_cart_cartitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='quantity',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='cartitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop_app.product'),
        ),
    ]
