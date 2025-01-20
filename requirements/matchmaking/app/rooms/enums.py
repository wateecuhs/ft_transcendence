from django.db.models import TextChoices

class MessageType:

    class Tournament(TextChoices):
        CREATE = "tournament.create"
        JOIN = "tournament.join"
        LEAVE = "tournament.leave"
        START = "tournament.start"
        DELETE = "tournament.delete"
        UPDATE = "tournament.update"
        RESULT = "tournament.result"

    class Matchmaking(TextChoices):
        JOIN = "matchmaking.join"
        LEAVE = "matchmaking.leave"
        START = "matchmaking.start"