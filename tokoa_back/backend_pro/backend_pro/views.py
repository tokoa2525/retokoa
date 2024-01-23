from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from backend_app.models import MyUser
from django.conf import settings
import requests



# ログイン用のビュー
class LoginView(APIView):
    def post(self, request):
        name = request.data.get('name')
        password = request.data.get('password')
        user = authenticate(name=name, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
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
        return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = MyUser.objects.create_user(
            name=name,
            password=password
        )
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



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
