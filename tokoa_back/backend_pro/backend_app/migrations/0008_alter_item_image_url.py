# Generated by Django 4.2.7 on 2023-11-20 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0007_alter_item_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='image_url',
            field=models.CharField(default='default_image.jpg', max_length=200),
        ),
    ]
