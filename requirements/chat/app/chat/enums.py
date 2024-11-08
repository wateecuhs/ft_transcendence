from django.db.models import TextChoices


class MessageType:

    class Status(TextChoices):
        UPDATE = "status.update"
        REQUEST = "status.request"

    class Chat(TextChoices):
        PUBLIC = "chat.public"
        PRIVATE = "chat.private"
        HISTORY = "chat.history"
