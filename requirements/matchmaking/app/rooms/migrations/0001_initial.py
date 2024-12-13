# Generated by Django 5.1.1 on 2024-12-13 12:14

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("label", models.CharField(max_length=255)),
                ("owner", models.UUIDField()),
                (
                    "room_type",
                    models.CharField(
                        choices=[("TOURNAMENT", "Tournament"), ("MATCH", "Match")],
                        default="MATCH",
                        max_length=10,
                    ),
                ),
                (
                    "max_players",
                    models.IntegerField(
                        choices=[(2, "Two"), (4, "Four"), (8, "Eight")], default=2
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PLAYING", "Playing"),
                            ("WAITING", "Waiting"),
                            ("FINISHED", "Finished"),
                            ("READY", "Ready"),
                        ],
                        default="WAITING",
                        max_length=8,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("username", models.CharField(max_length=255)),
                ("status", models.CharField(default="ONLINE", max_length=8)),
                ("room", models.CharField(blank=True, null=True)),
            ],
        ),
    ]
