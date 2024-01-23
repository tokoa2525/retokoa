from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class MyUserManager(BaseUserManager):
    def create_user(self, name, password=None, **extra_fields):
        if not name:
            raise ValueError('Users must have a name.')
        user = self.model(name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(name, password, **extra_fields)

class MyUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, unique=True)
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)  # is_staff フィールドを追加

    objects = MyUserManager()

    USERNAME_FIELD = 'name'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name

class Upload(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='uploads')
    image_url = models.CharField(max_length=255)
    upload_date = models.DateTimeField(default=timezone.now)
    is_sorted_correctly = models.BooleanField(default=False)
    points_awarded = models.IntegerField(default=0)

    def __str__(self):
        return f'Upload {self.id} by {self.user}'

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    points_required = models.IntegerField()
    stock = models.IntegerField()

    def __str__(self):
        return self.name

class Exchange(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='exchanges')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='exchanges')
    exchange_date = models.DateTimeField(default=timezone.now)
    points_used = models.IntegerField()

    def __str__(self):
        return f'Exchange {self.id} by {self.user} for {self.item}'
