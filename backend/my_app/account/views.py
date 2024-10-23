from django.shortcuts import render
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError 
from channels.db import database_sync_to_async
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

@database_sync_to_async
def authenticate_websocket(self, scope, token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        self.verify_token(payload=payload)

        user_id = payload['id']
        user= User.objects.get(id=user_id)
        return user
    except (InvalidTokenError, ExpiredSignatureError, User.DoesNotExist):
        return AuthenticationFailed("Invalid Token!!")
