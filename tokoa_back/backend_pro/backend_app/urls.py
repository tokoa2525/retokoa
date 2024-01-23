from django.urls import path, include
from .views import (
    ItemViewSet, register_user, ImageUploadView, LoginView, InquiryViewSet, 
    ExchangeCouponView, UserCouponsView, UserPointsView, UserDetailsView, 
    ItemDetailView, UnjudgedPhotosView, JudgePhotoView,VerifyTokenView,
    UserNotificationsView, UpdateUserProfileView, RegionStatisticsView
)
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# DefaultRouter のインスタンスを作成
router = DefaultRouter()
# ItemViewSet と InquiryViewSet のルーティングを設定
router.register(r'items', ItemViewSet)
router.register(r'inquiries', InquiryViewSet)

urlpatterns = [
    # ユーザー登録用のエンドポイント
    path('register/', register_user, name='register_user'),
    
    # ログイン用のエンドポイント
    path('login/', LoginView.as_view(), name='login'),

    # REST Framework のルーターを含める（ItemViewSet, InquiryViewSet など）
    path('', include(router.urls)),

    # 画像アップロード用のエンドポイント
    path('upload/', ImageUploadView.as_view(), name='image_upload'),

    # クーポン交換用のエンドポイント
    path('exchange-coupon/', ExchangeCouponView.as_view(), name='exchange_coupon'),

    # クーポン一覧表示用のエンドポイント
    path('user-coupons/', UserCouponsView.as_view(), name='user_coupons'),
    
    # ユーザーポイント関連用のエンドポイント
    path('user-points/', UserPointsView.as_view(), name='user_points'),
    
    # ユーザー詳細情報取得用のエンドポイント
    path('user-details/', UserDetailsView.as_view(), name='user_details'),
    
    #クーポン情報用のエンドポイント
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item_detail'),
    
    # 未判定の写真を取得するエンドポイント
    path('unjudged-photos/', UnjudgedPhotosView.as_view(), name='unjudged_photos'),

    # 写真に対する判定を保存するエンドポイント
    path('judge-photo/<int:photo_id>/', JudgePhotoView.as_view(), name='judge_photo'),

    # トークンが有効かどうか確認するためのエンドポイント
    path('verifyToken/', VerifyTokenView.as_view(), name='verify-token'),
    
    # 通知一覧を取得するためのエンドポイント
    path('notifications/', UserNotificationsView.as_view(), name='user_notifications'),
    
    # ユーザープロフィール用のエンドポイント
    path('update_profile/', UpdateUserProfileView.as_view(), name='update_profile'),

    #地域別統計情報のエンドポイント
    path('region-statistics/<str:region>/', RegionStatisticsView.as_view(), name='region_statistics'),

]

