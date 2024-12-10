from django.db import models
from uuid import uuid4

class Room(models.Model):
    class Status(models.TextChoices):
        PLAYING = "PLAYING", "Playing"
        WAITING = "WAITING", "Waiting"
        FINISHED = "FINISHED", "Finished"
        READY = "READY", "Ready"

    class Type(models.TextChoices):
        TOURNAMENT = "TOURNAMENT", "Tournament"
        MATCH = "MATCH", "Match"

    class MaxPlayers(models.IntegerChoices):
        TWO = 2
        FOUR = 4
        EIGHT = 8

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    label = models.CharField(max_length=255)

    owner = models.UUIDField()
    room_type = models.CharField(max_length=10, choices=Type.choices, default=Type.MATCH)
    max_players = models.IntegerField(choices=MaxPlayers.choices, default=MaxPlayers.TWO)
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.WAITING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label