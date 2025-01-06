from django.db import models
from uuid import uuid4

class Tournament(models.Model):
    class Status(models.TextChoices):
        PLAYING = "PLAYING", "Playing"
        PENDING = "PENDING", "Pending"
        FINISHED = "FINISHED", "Finished"
        READY = "READY", "Ready"
        CANCELLED = "CANCELLED", "Cancelled"

    class Round(models.TextChoices):
        FIRST = "FIRST", "First"
        FINAL = "FINAL", "Final"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=255)
    owner = models.UUIDField()
    players = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    round = models.CharField(max_length=5, choices=Round.choices, default=Round.FIRST)
    matches = models.JSONField(default=list)

    def __str__(self):
        return self.name