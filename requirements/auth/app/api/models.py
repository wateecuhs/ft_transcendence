from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from rest_framework.exceptions import ValidationError
from cryptography.fernet import Fernet
import os, base64, uuid

key = base64.urlsafe_b64encode(os.urandom(32))
cipher = Fernet(key)

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    duration = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    class Meta:
        db_table = 'tournaments'

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True, validators=[MinLengthValidator(2)])
    alias = models.CharField(max_length=30, unique=False, validators=[MinLengthValidator(2)])
    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='friend_of')
    status = models.PositiveSmallIntegerField(("Status"), choices=[
        (1, ("Active")),
        (2, ("Inactive")),
        (3, ("Pending Activation"))
    ], default=1)
    avatar = models.ImageField(("Avatar"), upload_to="avatars/", default="image/default_pp.png", blank=True)
    tournament = models.OneToOneField(Tournament,  on_delete=models.SET_NULL, null=True, blank=True, related_name='user')
    email = models.EmailField(unique=True)
    is_42_account = models.BooleanField()
    avatar_path = models.CharField()
    is_42_pp = models.BooleanField()
    access_token = models.CharField()
    refresh_token = models.CharField()
    room_id = models.UUIDField(null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    matches_number = models.PositiveIntegerField(default=0)
    matches_win = models.PositiveIntegerField(default=0)
    matches_lose = models.PositiveIntegerField(default=0)
    winrate = models.PositiveIntegerField(default=0)
    goal_scored = models.PositiveIntegerField(default=0)
    goal_conceded = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name

    @property
    def is_superuser(self):
        return False

    @property
    def is_activate(self):
        return self.status == 1

    @property
    def is_inactive(self):
        return self.status == 2

    @property
    def is_pending_activation(self):
        return self.status == 3

    def deactivate(self):
        self.status = 2

    def activate(self):
        self.status = 1
        self.save()

    @classmethod
    def get_user_by_name(cls, name):
        return cls.objects.filter(username=name).first()

    @classmethod
    def get_user_by_id(cls, id):
        return cls.objects.filter(id=id).first()

    @classmethod
    def add_user(cls, username, email, avatar_path, status=1, avatar=None, tournament_id=None):
        if (CustomUser.get_user_by_name(name=username) is None):
            user = cls(username=username, alias=username, status=status, avatar=avatar, tournament=tournament_id, email=email, is_42_account=True, avatar_path=avatar_path, is_42_pp=True)
            user.save()
            return user

    @classmethod
    def add_user_by_form(cls, username, password, email, avatar, status=1, tournament_id=None):
        if CustomUser.get_user_by_name(name=username) is not None:
            raise ValidationError("Username already taken.")
        user = cls(username=username, alias=username, email=email, password=password, status=status, avatar=avatar, tournament_id=tournament_id, is_42_account=False, is_42_pp=False)
        user.save()
        return user

    @classmethod
    def update_user(cls, user_id, **kwargs):
        user = cls.objects.get(pk=user_id)
        for attr, value in kwargs.items():
            setattr(user, attr, value)
        user.save()

    @classmethod
    def delete_user(cls, user_id):
        cls.objects.filter(pk=user_id).delete

    @classmethod
    def set_alias(cls, user, new_alias):
        user.alias = new_alias
        user.save()

    @classmethod
    def set_image(cls, user, new_PP):
        user.avatar = new_PP
        user.avatar_path = new_PP
        user.save()

    @classmethod
    def set_email(cls, user, newEmail):
        user.email = newEmail
        print(f"set email {user.email}")
        user.save()

    @classmethod
    def set_password(cls, user, newPassword):
        user.password = newPassword
        user.save()

    @classmethod
    def set_refresh_token(cls, user, token):
        user.refresh_token = cipher.encrypt(token.encode())

    @classmethod
    def get_refresh_token(cls, user, token):
        return cipher.decrypt(user.refresh_token).decode()

    @classmethod
    def set_access_token(cls, user, token):
        user.access_token = token


class   Match(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="match_history")
    user_id = models.UUIDField()
    status = models.PositiveSmallIntegerField(("Status"), choices=[
        (1, ("Win")),
        (2, ("Loss")),
    ], default=1)
    opponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="opponent_match_history")
    date = models.DateField()
    user_score = models.PositiveSmallIntegerField()
    opponent_score = models.PositiveSmallIntegerField()
    opponent_id = models.UUIDField()

    class Meta:
        db_table = 'matches'

    @classmethod
    def create_match(cls, user, opponent, date, status, user_score, opponent_score):
        match = cls(user=user, user_id=user.id, opponent=opponent, opponent_id=opponent.id, date=date, status=status, user_score=user_score, opponent_score=opponent_score)
        match.save()
        user.matches_number = user.matches_number + 1
        if status is "win":
            user.matches_win = user.matches_win + 1
        else:
            user.matches_lose = user.matches_lose + 1
        user.winrate = (user.matches_win / user.matches_number) * 100
        user.goal_scored = user.goal_score + user_score
        user.goal_conceded = user.goal_conded + opponent_score
        user.save()
