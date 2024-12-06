from django.db import models
from .enums import MessageType
from uuid import uuid4

# Create your models here.
class Relationship(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        NEUTRAL = "NEUTRAL", "Neutral"
        BLOCKED = "BLOCKED", "Blocked"

    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )

    class Meta:
        unique_together = ("sender", "receiver")

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"

    def accept(self):
        self.status = Relationship.Status.ACCEPTED
        self.save()
    
    def reject(self):
        self.status = Relationship.Status.REJECTED
        self.save()
    
    def block(self):
        self.status = Relationship.Status.BLOCKED
        self.save()
    
    def unblock(self):
        self.status = Relationship.Status.NEUTRAL
        self.save()
    
    def pending(self):
        self.status = Relationship.Status.PENDING
        self.save()

class User(models.Model):
    class Status(models.TextChoices):
        ONLINE = "ON", "Online"
        OFFLINE = "OFF", "Offline"
        PLAYING = "PLAYING", "Playing"

    # This will probably turn into referenceID that references the auth service's user ID
    id = models.UUIDField(primary_key=True, editable=False)

    name = models.CharField(max_length=100)
    friends = models.ManyToManyField(
        "self", through=Relationship, symmetrical=False, related_name="+"
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.OFFLINE
    )

    def __str__(self):
        return self.name


class Message(models.Model):
    class Meta:
        ordering = ["created_at"]

    class Type(models.TextChoices):
        PRIVATE = MessageType.Chat.PRIVATE, "Private"
        PUBLIC = MessageType.Chat.PUBLIC, "Public"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    type = models.CharField(max_length=15, choices=Type.choices, default=Type.PUBLIC)
    content = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content