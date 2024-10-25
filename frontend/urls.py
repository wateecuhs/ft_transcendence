from django.urls import path
from . import views

app_name = "frontend"

urlpatterns = [
	path("", views.index, name="index"),
	path("room/<int:room_code>/", views.room_join, name="room"),
	path("add/<str:username>/", views.friend_add, name="add"),
	path("get_user_info/", views.get_user_info, name="get_user_info"),
	path("confirm_token/", views.confirm_token, name="confirm_token"),
	path("settings_page/", views.settings_page, name="settings"),
	path("changeAlias/", views.changeAlias, name="changeAlias"),
	path("changePP/", views.changePP, name="changePP"),
	path("changeEmail/", views.changeEmail, name="changeEmail"),
	path("changePassword/", views.changePassword, name="changePassword")
]