from django.db import models


# Create your models here.
class Relationship(models.Model):
    class Status(models.TextChoices):
        NEUTRAL = "NEUTRAL", "Neutral"
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        BLOCKED = "BLOCKED", "Blocked"

    sender = models.ForeignKey("User", on_delete=models.CASCADE, related_name="from")
    receiver = models.ForeignKey("User", on_delete=models.CASCADE, related_name="to")
    status = models.CharField(
        max_length=8, choices=Status.choices, default=Status.PENDING
    )

    class Meta:
        unique_together = ("sender", "receiver")

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"


class User(models.Model):
    class Status(models.TextChoices):
        ONLINE = "ON", "Online"
        OFFLINE = "OFF", "Offline"
        PLAYING = "PLAYING", "Playing"

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
    class Type(models.TextChoices):
        PRIVATE = "PRIVATE", "Private"
        PUBLIC = "PUBLIC", "Public"
        COMMAND = "COMMAND", "Command"

    id = models.UUIDField(primary_key=True, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
