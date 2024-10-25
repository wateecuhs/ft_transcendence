from django.urls import path
from zope.interface import named

from . import  views

urlpatterns = [
    path("", views.index, name="index_login"),
    path("register/", views.register, name="register"),
    path("profile/", views.user_profile, name="user_profile"),
    path("login/", views.loginview, name="login"),
]