from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("confirm_token/", views.confirm_token, name="confirm_token"),
]
