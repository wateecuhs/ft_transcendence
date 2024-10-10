from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    duration = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    class Meta:
        db_table = 'tournaments'

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(_("Name"), max_length=100)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='friend_of')
    status = models.PositiveSmallIntegerField(_("Status"), choices=[
        (1, _("Active")),
        (2, _("Inactive")),
        (3, _("Pending Activation"))
    ], default=1)
    avatar = models.ImageField(_("Avatar"), upload_to="avatars/", null=True, blank=True)

    tournament = models.OneToOneField(Tournament,  on_delete=models.SET_NULL, null=True, blank=True, related_name='user')

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name
    
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
    def add_user(cls, name, status=None, avatar=None, tournament_id=None):
        user = cls(name=name, status=status, avatar=avatar, tournament=tournament_id)
        user.save()
        return user
    
    @classmethod
    def get_user_by_name(cls, name):
        return cls.objects.filter(name=name).first()
    
    @classmethod
    def update_user(cls, user_id, **kwargs):
        user = cls.objects.get(pk=user_id)
        for attr, value in kwargs.items():
            setattr(user, attr, value)
        user.save()
    
    @classmethod
    def delete_user(cls, user_id):
        cls.objects.filter(pk=user_id).delete
