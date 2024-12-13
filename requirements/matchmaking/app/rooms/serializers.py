from rest_framework import serializers
import requests
from .models import Room, Tournament

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'status', 'created_at', 'name', 'owner']
    
    def validate_owner(self, value):
        # response = requests.get(f'http://localhost:8000/api/users/{value}')
        # if response.status_code != 200:
        #     raise serializers.ValidationError("Owner does not exist")
        return value

    def validate(self, attrs):
        if Room.objects.filter(name=attrs['name']).exclude(status=Room.Status.FINISHED).exists():
            raise serializers.ValidationError("Room with this name already exists")
        return super().validate(attrs)

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'status', 'created_at', 'name', 'owner', 'players', 'round']
    
    def validate_owner(self, value):
        # response = requests.get(f'http://localhost:8000/api/users/{value}')
        # if response.status_code != 200:
        #     raise serializers.ValidationError("Owner does not exist")
        return value

    def validate(self, attrs):
        if Tournament.objects.filter(name=attrs['name']).exclude(status=Tournament.Status.FINISHED).exists():
            raise serializers.ValidationError("Tournament with this name already exists")
        return super().validate(attrs)