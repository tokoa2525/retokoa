# Generated by Django 4.2.7 on 2023-11-29 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0022_regionstatistics'),
    ]

    operations = [
        migrations.AddField(
            model_name='regionstatistics',
            name='user_age_group_counts',
            field=models.JSONField(default=dict),
        ),
    ]
