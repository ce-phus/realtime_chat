from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField(source="get_full_name")

    class Meta:
        model = User
        fields = [
            'id', 
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name'
        ]

    def get_first_name(self, obj):
        return obj.first_name.title()

    def get_last_name(self, obj):
        return obj.last_name.title()
    
    def to_representation(self, instance):
        representation = super(UserSerializer, self).to_representation(instance)
        if instance.is_superuser:
            representation["admin"] = True
        return representation


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]