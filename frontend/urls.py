from django.urls import path
from . import views

app_name = "frontend"

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login, name="login"),
    path("room/<int:room_code>/", views.room_join, name="room"),
    path("add/<str:username>/", views.friend_add, name="add"),
    path("get_user_info/", views.get_user_info, name="get_user_info"),
]
