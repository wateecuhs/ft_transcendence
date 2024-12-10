from django.db.models import TextChoices

class MessageType:
    class Room(TextChoices):
        JOIN = "room.join"
        LEAVE = "room.leave"
        CREATE = "room.create"
        DELETE = "room.delete"
        KICK = "room.kick"

    class Matchmaking(TextChoices):
        JOIN = "matchmaking.join"
        LEAVE = "matchmaking.leave"
        ACCEPT = "matchmaking.accept"

    
