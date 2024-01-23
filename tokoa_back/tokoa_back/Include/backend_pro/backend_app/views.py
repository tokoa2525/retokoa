from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend_app.models import MyUser  # カスタムユーザーモデルをimport
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def register_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    password2 = data.get('password2')  # 再パスワード

    # パスワードと再パスワードの一致を確認(フロントエンドでもやっているが、セキュリティ強化のため)
    if password != password2:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    # ユーザー名の重複をチェック
    if MyUser.objects.filter(username=username).exists():
        return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = MyUser.objects.create(
            username=username,
            password=make_password(password)
        )
        user.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
