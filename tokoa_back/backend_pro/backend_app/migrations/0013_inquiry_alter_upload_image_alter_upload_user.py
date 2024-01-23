# Generated by Django 4.2.7 on 2023-11-22 05:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0012_alter_upload_image_alter_upload_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('phone_number', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('message', models.TextField()),
                ('inquiry_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.AlterField(
            model_name='upload',
            name='image',
            field=models.ImageField(default='default_image.jpg', upload_to='uploads/'),
        ),
        migrations.AlterField(
            model_name='upload',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploads', to=settings.AUTH_USER_MODEL),
        ),
    ]
