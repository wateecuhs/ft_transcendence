from django.db.models import TextChoices

class MessageType:
    class Room(TextChoices):
        JOIN = "room.join"
        LEAVE = "room.leave"
        CREATE = "room.create"
        DELETE = "room.delete"

    
