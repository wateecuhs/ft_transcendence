from django.db import models
from uuid import uuid4

class Room(models.Model):
    class Status(models.TextChoices):
        PLAYING = "PLAYING", "Playing"
        WAITING = "WAITING", "Waiting"
        FINISHED = "FINISHED", "Finished"
        READY = "READY", "Ready"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=255)
    players = models.JSONField(default=list)
    owner = models.UUIDField()
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.WAITING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    class Status(models.TextChoices):
        PLAYING = "PLAYING", "Playing"
        WAITING = "WAITING", "Waiting"
        FINISHED = "FINISHED", "Finished"
        READY = "READY", "Ready"

    class Round(models.TextChoices):
        FIRST = "FIRST", "First"
        FINAL = "FINAL", "Final"

    class MaxPlayers(models.IntegerChoices):
        TWO = 2
        FOUR = 4

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=255)
    owner = models.UUIDField()
    players = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.WAITING)
    round = models.CharField(max_length=5, choices=Round.choices, default=Round.FIRST)
    max_players = models.IntegerField(choices=MaxPlayers.choices, default=MaxPlayers.FOUR)

    def __str__(self):
        return self.name