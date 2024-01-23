from rest_framework import serializers
from .models import Item
from .models import Upload
from .models import Inquiry
from .models import Exchange
from .models import Notification
from .models import RegionStatistics

class ItemSerializer(serializers.ModelSerializer): #shop
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'points_required', 'stock', 'image_url', 'coupon_code', 'product_url'] 
        
        
class UploadSerializer(serializers.ModelSerializer): #upload
    class Meta:
        model = Upload
        fields = ['id', 'user', 'image','upload_date','is_sorted_correctly','points_awarded','category', 'image_hash']  # ここに必要なフィールドをリストします

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ['name', 'phone_number', 'email', 'message', 'inquiry_date']
        
class ExchangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exchange
        fields = ['id', 'user', 'item', 'exchange_date', 'points_used']
        
class NotificationSerializer(serializers.ModelSerializer):
    mascot_image = serializers.CharField(source='mascot.msk_url')

    class Meta:
        model = Notification
        fields = ('id', 'user', 'message', 'created_at', 'mascot_image')

class RegionStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegionStatistics
        fields = '__all__'
