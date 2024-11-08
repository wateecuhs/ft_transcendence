from django.urls import path
from .views import loginAPI, register, get_user_info

urlpatterns = [
    path("register/", register.as_view(), name="register"),
    path("login/", loginAPI.as_view(), name="login"),
]