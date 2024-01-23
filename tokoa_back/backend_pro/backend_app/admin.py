from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser, Item, Upload, Inquiry, Exchange, Mascot, RegionStatistics

class UploadAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'image', 'upload_date', 'is_sorted_correctly', 'judged', 'points_awarded', 'category')  # 管理画面で表示したいフィールド
    list_filter = ('user', 'upload_date', 'is_sorted_correctly', 'judged', 'category')  # フィルターとして使用したいフィールド
    search_fields = ('user__name', 'category')  # 検索可能なフィールド
    ordering = ('-upload_date',)  # デフォルトの並び順
    
admin.site.register(Upload, UploadAdmin)

class MyUserAdmin(UserAdmin):
    model = MyUser
    list_display = ('name', 'points', 'region', 'age_group', 'is_staff', 'is_active', 'last_login', 'date_joined')  # region と age_group を追加
    list_filter = ('name', 'region', 'age_group', 'is_staff', 'is_active')  # region と age_group を追加
    fieldsets = (
        (None, {'fields': ('name', 'password', 'points', 'region', 'age_group')}),  # region と age_group を追加
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('name', 'password1', 'password2', 'points', 'region', 'age_group', 'is_staff', 'is_active')}  # region と age_group を追加
        ),
    )
    search_fields = ('name',)
    ordering = ('name',)

admin.site.register(MyUser, MyUserAdmin)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'points_required', 'stock', 'coupon_code', 'product_url') 
    list_editable = ('coupon_code','product_url') 
    
@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'message', 'inquiry_date')
    list_filter = ('name', 'phone_number', 'email', 'inquiry_date')
    search_fields = ('name', 'email')
    ordering = ('-inquiry_date',)
    
@admin.register(Exchange)
class ExchangeAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'exchange_date', 'points_used')
    list_filter = ('user', 'exchange_date')
    search_fields = ('user__name', 'item__name')
    ordering = ('-exchange_date',)
    
@admin.register(Mascot)
class MascotAdmin(admin.ModelAdmin):
    list_display = ('id', 'msk_url') 

@admin.register(RegionStatistics)
class RegionStatisticsAdmin(admin.ModelAdmin):
    list_display = ['region', 'total_uploads', 'successful_sorts', 'user_age_group_counts']
    list_filter = ['region']
    search_fields = ['region']