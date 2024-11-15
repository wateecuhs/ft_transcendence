from rest_framework import serializers
import requests
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'status', 'created_at']
    
    def validate_player_1(self, value):
        print("Validating player 1", flush=True)
        # This will be used when the /users/<id>/ endpoint is implemented
        # r = requests.get(f"http://auth:8001/users/{value}/")
        # if r.status_code != 200:
        #     raise serializers.ValidationError(f"Player 1 with ID {value} does not exist.")
        return value

    def validate_player_2(self, value):
        print("Validating player 2", flush=True)
        # This will be used when the /users/<id>/ endpoint is implemented
        # r = requests.get(f"http://auth:8001/users/{value}/")
        # if r.status_code != 200:
        #     raise serializers.ValidationError(f"Player 2 with ID {value} does not exist.")
        return value