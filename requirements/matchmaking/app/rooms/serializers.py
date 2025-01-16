from rest_framework import serializers, exceptions
from .models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'status', 'created_at', 'name', 'owner', 'players', 'round', 'matches']

    def validate_name(self, value):
        if not value.isalnum():
            raise exceptions.ValidationError("Name must be alphanumeric")
        if ' ' in value:
            raise exceptions.ValidationError("Name must not contain spaces")
        if len(value) < 3:
            raise exceptions.ValidationError("Name must be at least 3 characters long")
        if len(value) > 20:
            raise exceptions.ValidationError("Name must be at most 20 characters long")
        return value

    def validate(self, attrs):
        if Tournament.objects.filter(name=attrs['name']).exclude(status=Tournament.Status.CANCELLED).exists():
            raise exceptions.ValidationError("Tournament with this name already exists")
        return super().validate(attrs)