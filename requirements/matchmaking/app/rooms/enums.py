from django.db.models import TextChoices

class MessageType:
    
    class Tournament(TextChoices):
        CREATE = "tournament.create"
        JOIN = "tournament.join"
        LEAVE = "tournament.leave"
        START = "tournament.start"
        DELETE = "tournament.delete"

    
