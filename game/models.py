from django.db import models

class   User(models.Model):
    login = models.CharField(max_length=8)
    profile_picture = models.ImageField()

