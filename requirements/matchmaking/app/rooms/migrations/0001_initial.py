# Generated by Django 5.1.1 on 2025-01-09 14:08

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Tournament",
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
                ("name", models.CharField(max_length=255)),
                ("owner", models.UUIDField()),
                ("players", models.JSONField(default=list)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PLAYING", "Playing"),
                            ("PENDING", "Pending"),
                            ("FINISHED", "Finished"),
                            ("READY", "Ready"),
                            ("CANCELLED", "Cancelled"),
                        ],
                        default="PENDING",
                        max_length=10,
                    ),
                ),
                (
                    "round",
                    models.CharField(
                        choices=[("FIRST", "First"), ("FINAL", "Final")],
                        default="FIRST",
                        max_length=5,
                    ),
                ),
                ("matches", models.JSONField(default=list)),
            ],
        ),
    ]
