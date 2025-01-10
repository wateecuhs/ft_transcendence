from rest_framework import serializers
from .models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'status', 'created_at', 'name', 'owner', 'players', 'round']

    def validate_name(self, value):
        if not value.isalnum():
            raise serializers.ValidationError("Name must be alphanumeric")
        if ' ' in value:
            raise serializers.ValidationError("Name must not contain spaces")
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long")
        if len(value) > 20:
            raise serializers.ValidationError("Name must be at most 50 characters long")
        return value

    def validate(self, attrs):
        if Tournament.objects.filter(name=attrs['name']).exclude(status=Tournament.Status.FINISHED).exclude(status=Tournament.Status.CANCELLED).exists():
            raise serializers.ValidationError("Tournament with this name already exists")
        return super().validate(attrs)