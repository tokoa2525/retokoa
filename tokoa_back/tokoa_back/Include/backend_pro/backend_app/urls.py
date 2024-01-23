# backend_app/urls.py

from django.urls import path
from .views import register_user
from . import views

urlpatterns = [
    path('register/', register_user, name='register_user'),
]
