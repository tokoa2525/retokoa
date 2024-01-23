from django.contrib.auth import authenticate, login
from django.conf import settings
from django.shortcuts import get_object_or_404

# REST framework関連のインポート
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenVerifyView

# モデルとシリアライザのインポート
from backend_app.models import MyUser, Item, Upload, Inquiry, Exchange, Mascot, Notification, RegionStatistics
from .serializers import ItemSerializer, UploadSerializer, InquirySerializer, ExchangeSerializer, NotificationSerializer, RegionStatisticsSerializer
from django.db.models import F
from random import randint
import logging
import json
from django.db.models import Count, Case, When, IntegerField
logger = logging.getLogger(__name__)
import hashlib
from django.core.files.uploadedfile import InMemoryUploadedFile

# 地域ごとの統計情報を共有するビュー
class RegionStatisticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, region=None):
        try:
            stats = RegionStatistics.objects.get(region=region) if region else RegionStatistics.objects.all()
            serializer = RegionStatisticsSerializer(stats, many=not region)
            return Response(serializer.data)
        except RegionStatistics.DoesNotExist:
            # 地域別の統計情報が存在しない場合、デフォルト値を持つレスポンスを返す
            default_data = {
                'total_uploads': 0,
                'successful_sorts': 0,
                'user_age_group_counts': {}
            }
            return Response(default_data, status=status.HTTP_200_OK)



# ユーザープロフィール用のビュー
class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        age_group = request.data.get('age_group')
        region = request.data.get('region')

        if age_group not in [choice[0] for choice in MyUser.AGE_GROUPS]:
            return Response({'error': '無効な年代'}, status=status.HTTP_400_BAD_REQUEST)

        if region not in [choice[0] for choice in MyUser.REGIONS]:
            return Response({'error': '無効な地域'}, status=status.HTTP_400_BAD_REQUEST)

        user.age_group = age_group
        user.region = region
        user.save()

        return Response({'message': 'プロフィールが更新されました'}, status=status.HTTP_200_OK)

# 通知一覧を取得するビュー
class UserNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

# 未判定の写真を取得するビュー
class UnjudgedPhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unjudged_photos = Upload.objects.filter(judged=False)
        serializer = UploadSerializer(unjudged_photos, many=True)
        return Response(serializer.data)

# 写真に対する判定を保存するビュー
class JudgePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, photo_id):
        photo = get_object_or_404(Upload, id=photo_id)
        judgement = request.data.get('judgement', False)
        mascot = Mascot.objects.get(id=1 if judgement else 2)

        if judgement:
            photo.is_sorted_correctly = True
            random_points = randint(3, 10)
            photo.points_awarded = random_points
            photo.user.points += random_points
            photo.user.save()
            message = f"ポイントを獲得しました。 獲得ポイント：{random_points}pt"
        else:
            photo.is_sorted_correctly = False
            message = f"ポイントを獲得できませんでした。"

        photo.judged = True
        photo.save()

        # 通知の作成
        Notification.objects.create(
            user=photo.user,
            message=message,
            mascot=mascot
        )

        # 地域統計情報の更新
        self.update_region_statistics(photo.user, photo.is_sorted_correctly)

        return Response({'status': 'success'}, status=status.HTTP_200_OK)

    def update_region_statistics(self, user, is_sorted_correctly):
        # 地域統計情報を取得または作成
        region_stats, created = RegionStatistics.objects.get_or_create(region=user.region)

        # 地域の統計情報を更新
        region_stats.total_uploads += 1
        if is_sorted_correctly:
            region_stats.successful_sorts += 1

        # 年齢層別ユーザー数を更新
        age_group = user.age_group
        age_group_counts = region_stats.user_age_group_counts
        age_group_counts[age_group] = age_group_counts.get(age_group, 0) + 1
        region_stats.user_age_group_counts = age_group_counts

        # 統計情報を保存
        region_stats.save()

# トークンが有効かどうかを確認するビュー
class VerifyTokenView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        is_token_valid = response.status_code == status.HTTP_200_OK
        return Response({'isValid': is_token_valid})

        

# クーポン詳細ビュー
class ItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
            serializer = ItemSerializer(item)
            return Response(serializer.data)
        except Item.DoesNotExist:
            return Response({'error': 'Item not found'}, status=404)

# ユーザー詳細情報取得用のビュー
class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'user_id': user.id,
            'name': user.name,
            'points': user.points
            # その他必要な情報を追加
        }, status=status.HTTP_200_OK)

# ユーザーポイント関連用のエンドポイント
class UserPointsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'points': user.points}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        points_to_add = request.data.get('points', 0)
        user.points += int(points_to_add)
        user.save()
        return Response({'points': user.points}, status=status.HTTP_200_OK)

#クーポン一覧用のビュー
class UserCouponsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            exchanges = Exchange.objects.filter(user=user)
            coupons = [{
                'item_id': exchange.item.id,
                'item': exchange.item.name,
                'points_used': exchange.points_used,
                'image_url': exchange.item.image_url  # 画像URLを追加
            } for exchange in exchanges]
            return Response({'coupons': coupons}, status=status.HTTP_200_OK)
        except MyUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#クーポン交換用のビュー
class ExchangeCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        item_id = request.data.get('item_id')
        user = request.user

        try:
            item = Item.objects.get(id=item_id)
            # 在庫が足りているかチェック
            if item.stock <= 0:
                return Response({'error': '商品の在庫がありません。'}, status=status.HTTP_400_BAD_REQUEST)

            if user.points < item.points_required:
                return Response({'error': '必要なポイントが足りません。'}, status=status.HTTP_400_BAD_REQUEST)

            # 商品交換処理
            Exchange.objects.create(user=user, item=item, points_used=item.points_required)

            # ユーザーのポイントを減らす
            user.points -= item.points_required
            user.save()

            # 商品の在庫を減らす
            item.stock -= 1
            item.save()

            return Response({'success': 'クーポンが交換されました。'}, status=status.HTTP_200_OK)
        except Item.DoesNotExist as e:
            logger.error('Error in ExchangeCouponView: %s', e)
            return Response({'error': '商品が見つかりません。'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error('Error in ExchangeCouponView: %s', e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)





#お問合せ用のビュー
class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

#アップロード用のビュー
class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        
        data = request.data
        # リクエストから 'user' フィールドを削除し、
        # request.user から自動的にユーザー情報をセットする
        if 'user' not in data:
            data['user'] = request.user.id

        
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():#バリデーションを行う
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#ItemViewset
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
# ログイン用のビュー
class LoginView(APIView):
    def post(self, request):
        name = request.data.get('name')
        password = request.data.get('password')
        user = authenticate(request, name=name, password=password)  # requestを追加

        if user is not None:
            # Djangoのログイン処理を行い、セッションを開始します
            login(request, user)  # この行を追加
            refresh = RefreshToken.for_user(user)
            is_admin = user.is_staff
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'isAdmin': is_admin,
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
# ユーザー登録用のビュー
@api_view(['POST'])
def register_user(request):
    data = request.data
    name = data.get('name')
    password = data.get('password')
    recaptcha_response = data.get('recaptcha_response')

    #if not verify_recaptcha(recaptcha_response):
        #return Response({"error": "CAPTCHA validation failed"}, status=status.HTTP_400_BAD_REQUEST)

    if MyUser.objects.filter(name=name).exists():
        return Response({"error": "このユーザー名は既に使用されています。"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = MyUser.objects.create_user(
            name=name,
            password=password
        )
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework.views import APIView
from .permissions import IsLoggedInUserOrRedirect

#保護されているかどうかのビュー
class SomeProtectedView(APIView):
    permission_classes = [IsLoggedInUserOrRedirect]

    def get(self, request):
        return Response({"message": "This is a protected view"}, status=status.HTTP_200_OK)

# reCAPTCHA検証用の関数
#def verify_recaptcha(recaptcha_response):
    #secret_key = settings.RECAPTCHA_SECRET_KEY  # 環境変数からシークレットキーを取得
    #data = {
        #'secret': secret_key,
        #'response': recaptcha_response
    #}
    #response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
    #result = response.json()
    #return result.get('success', False)