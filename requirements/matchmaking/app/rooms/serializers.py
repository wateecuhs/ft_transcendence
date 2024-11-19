from rest_framework import serializers
import requests
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'status', 'created_at', 'label', 'owner', 'room_type', 'max_players']
    
    def validate_owner(self, value):
        # response = requests.get(f'http://localhost:8000/api/users/{value}')
        # if response.status_code != 200:
        #     raise serializers.ValidationError("Owner does not exist")
        return value

    def validate(self, attrs):
        print(attrs, flush=True)
        if attrs['room_type'] == Room.Type.TOURNAMENT and not (attrs['max_players'] == Room.MaxPlayers.EIGHT or attrs['max_players'] == Room.MaxPlayers.FOUR):
            raise serializers.ValidationError("Tournament rooms must have 4 or 8 players")
        if attrs['room_type'] == Room.Type.MATCH and not (attrs['max_players'] == Room.MaxPlayers.TWO):
            raise serializers.ValidationError("Match rooms must have 2 players")
        if Room.objects.filter(label=attrs['label']).exclude(status=Room.Status.FINISHED).exists():
            raise serializers.ValidationError("Room with this label already exists")
        return super().validate(attrs)