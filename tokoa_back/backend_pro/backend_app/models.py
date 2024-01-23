from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import hashlib

# ユーザー管理マネージャーモデル
class MyUserManager(BaseUserManager):
    
    # 通常のユーザーを作成するメソッド
    def create_user(self, name, password=None, **extra_fields):
        if not name:
            raise ValueError('Users must have a name.')
        user = self.model(name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # スーパーユーザーを作成するメソッド
    def create_superuser(self, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(name, password, **extra_fields)

# カスタムユーザーモデル
class MyUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, unique=True)
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # 地域情報の選択肢
    REGIONS = (
        ('和歌山市', '和歌山市'),
        ('海南市', '海南市'),
        ('橋本市', '橋本市'),
        ('有田市', '有田市'),
        ('御坊市', '御坊市'),
        ('田辺市', '田辺市'),
        ('新宮市', '新宮市'),
        ('紀の川市', '紀の川市'),
        ('岩出市', '岩出市'),
    )
    region = models.CharField(max_length=50, choices=REGIONS, blank=True, null=True) # 地域情報

    # 年代の選択肢
    AGE_GROUPS = (
        ('10代', '10代'),
        ('20代', '20代'),
        ('30代', '30代'),
        ('40代', '40代'),
        ('50代', '50代'),
        ('60代以上', '60代以上'),
    )
    age_group = models.CharField(max_length=20, choices=AGE_GROUPS, blank=True, null=True) # 年代

    # ユーザー管理マネージャーの設定
    objects = MyUserManager()

    USERNAME_FIELD = 'name'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name

# アップロードモデル
class Upload(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='uploads')
    image = models.ImageField(upload_to='uploads/', default='default_image.jpg')
    upload_date = models.DateTimeField(default=timezone.now)
    is_sorted_correctly = models.BooleanField(default=False)#分別できたかどうか
    judged = models.BooleanField(default=False)
    points_awarded = models.IntegerField(default=0)
    GARBAGE_CATEGORIES = (
        ('ペットボトル', 'ペットボトル'),
        ('紙類', '紙類'),
        ('缶・ビン', '缶・ビン'),
    )
    category = models.CharField(max_length=50, choices=GARBAGE_CATEGORIES, default='ペットボトル')
    image_hash = models.CharField(max_length=64, blank=True)

    # 画像ファイルからハッシュ値を計算するsaveメソッドのオーバーライド
    def save(self, *args, **kwargs):
        # 画像ファイルからハッシュ値を計算
        if self.image:
            h = hashlib.sha256()
            for chunk in self.image.chunks():
                h.update(chunk)
            self.image_hash = h.hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Upload {self.id} by {self.user}'

# 商品モデル
class Item(models.Model): 
    name = models.CharField(verbose_name='アイテム名', max_length=255)
    description = models.TextField()
    points_required = models.IntegerField()
    stock = models.IntegerField()
    coupon_code = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(max_length=200, default='default_image.jpg')
    product_url = models.URLField(max_length=255, blank=True, null=True)

    # クーポン関連のフィールド
    is_coupon = models.BooleanField(default=False)
    coupon_validity = models.DateField(null=True, blank=True)
    def __str__(self):
        return self.name

# ポイント交換履歴モデル
class Exchange(models.Model): 
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='exchanges')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='exchanges')
    exchange_date = models.DateTimeField(default=timezone.now)
    points_used = models.IntegerField()

    def __str__(self):
        return f'Exchange {self.id} by {self.user} for {self.item}'

# お問い合わせモデル
class Inquiry(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    message = models.TextField()
    inquiry_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inquiry by {self.name} on {self.inquiry_date.strftime('%Y-%m-%d %H:%M')}"

#〇と×のマスコットの画像用モデル
class Mascot(models.Model):
    msk_url = models.URLField(max_length=200, default='default_image.jpg')

# 通知モデル
class Notification(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    mascot = models.ForeignKey(Mascot, on_delete=models.CASCADE, related_name='notifications') # 新たに追加

    def __str__(self):
        return f"Notification for {self.user.name} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"

# 地域統計モデル
class RegionStatistics(models.Model):
    region = models.CharField(max_length=50, choices=MyUser.REGIONS)
    total_uploads = models.IntegerField(default=0)
    successful_sorts = models.IntegerField(default=0)
    user_age_group_counts = models.JSONField(default=dict)