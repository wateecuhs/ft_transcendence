from django.db import models
from uuid import uuid4

# Create your models here.
class Room(models.Model):
    class Status(models.TextChoices):
        PLAYING = "PLAYING", "Playing"
        WAITING = "WAITING", "Waiting"
        FINISHED = "FINISHED", "Finished"
        READY = "READY", "Ready"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    label = models.SlugField(unique=True)
    player_1 = models.UUIDField()
    player_2 = models.UUIDField()
    player_1_ready = models.BooleanField(default=False)
    player_2_ready = models.BooleanField(default=False)
    status = models.CharField(
        max_length=8, choices=Status.choices, default=Status.WAITING
    )

    def __str__(self):
        return self.label