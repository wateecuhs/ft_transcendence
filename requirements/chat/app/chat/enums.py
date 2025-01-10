from django.db.models import TextChoices


class MessageType:

    class Status(TextChoices):
        UPDATE = "status.update"
        REQUEST = "status.request"

    class Chat(TextChoices):
        PUBLIC = "chat.public"
        PRIVATE = "chat.private"
        HISTORY = "chat.history"
    
    class Relationship(TextChoices):
        BLOCK = "relationship.block"
        UNBLOCK = "relationship.unblock"
        ACCEPT = "relationship.accept"
        REJECT = "relationship.reject"
        REQUEST = "relationship.request"
        REMOVE = "relationship.remove"

    class Match(TextChoices):
        INVITE = "match.invite"
        