from rest_framework import serializers
from .models import User, Relationship, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'status']

class RelationshipSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Relationship
        fields = ['sender', 'receiver', 'status']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'type', 'author', 'content', 'created_at']

    def validate_created_at(self, value):
        if not value:
            raise serializers.ValidationError("Message creation date cannot be empty.")
        return value

    def validate_type(self, value):
        if value not in Message.Type.values:
            raise serializers.ValidationError(f"Invalid message type. ({value})")
        return value
    
    def validate_content(self, value):
        if not value:
            raise serializers.ValidationError("Message content cannot be empty.")
        if len(value) > 256:
            raise serializers.ValidationError("Message content is too long.")
        return value

