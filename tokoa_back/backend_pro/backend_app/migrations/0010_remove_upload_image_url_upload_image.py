# Generated by Django 4.2.7 on 2023-11-21 03:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0009_alter_item_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='upload',
            name='image_url',
        ),
        migrations.AddField(
            model_name='upload',
            name='image',
            field=models.ImageField(default='default_image.jpg', upload_to='uploads/'),
        ),
    ]