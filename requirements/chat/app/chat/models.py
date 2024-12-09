from django.db import models
from uuid import uuid4
from .enums import MessageType

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
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
    )

    class Meta:
        unique_together = ("sender", "receiver")

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"

    def accept(self):
        self.status = Relationship.Status.ACCEPTED
        self.save()

        reverse_relationship, created = Relationship.objects.get_or_create(
            sender=self.receiver, 
            receiver=self.sender,
            defaults={'status': Relationship.Status.ACCEPTED}
        )
        
        if not created and reverse_relationship.status != Relationship.Status.ACCEPTED:
            reverse_relationship.status = Relationship.Status.ACCEPTED
            reverse_relationship.save()

    def remove(self):
        self.status = Relationship.Status.NEUTRAL
        self.save()

        Relationship.objects.filter(
            sender=self.receiver, 
            receiver=self.sender
        ).update(status=Relationship.Status.NEUTRAL)

    def request(self):
        self.status = Relationship.Status.PENDING
        self.save()

    def reject(self):
        self.status = Relationship.Status.NEUTRAL
        self.save()

        Relationship.objects.filter(
            sender=self.receiver, 
            receiver=self.sender
        ).update(status=Relationship.Status.REJECTED)

    def block(self):
        self.status = Relationship.Status.BLOCKED
        self.save()

    def unblock(self):
        self.status = Relationship.Status.NEUTRAL
        self.save()

class User(models.Model):
    class Status(models.TextChoices):
        ONLINE = "ON", "Online"
        OFFLINE = "OFF", "Offline"
        PLAYING = "PLAYING", "Playing"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    username = models.CharField(max_length=100, unique=True)
    status = models.CharField(
        max_length=10, 
        choices=Status.choices, 
        default=Status.OFFLINE
    )

    def __str__(self):
        return self.username

    def get_friends(self):
        accepted_relationships = Relationship.objects.filter(
            sender=self.username, 
            status=Relationship.Status.ACCEPTED
        )
        return User.objects.filter(
            username__in=[rel.receiver for rel in accepted_relationships]
        )

    def add_friend(self, friend):
        if not isinstance(friend, User):
            raise ValueError("Must be a User instance")
        
        relationship, created = Relationship.objects.get_or_create(
            sender=self.username, 
            receiver=friend.username,
            defaults={'status': Relationship.Status.ACCEPTED}
        )
        
        if not created:
            relationship.status = Relationship.Status.ACCEPTED
            relationship.save()
    
    def offline(self):
        self.status = User.Status.OFFLINE
        self.save()
    
    def online(self):
        self.status = User.Status.ONLINE
        self.save()

class Message(models.Model):
    class Type(models.TextChoices):
        PRIVATE = MessageType.Chat.PRIVATE, "Private"
        PUBLIC = MessageType.Chat.PUBLIC, "Public"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    type = models.CharField(
        max_length=15, 
        choices=Type.choices, 
        default=Type.PUBLIC
    )
    content = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author}: {self.content[:50]}"