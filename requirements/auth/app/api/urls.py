from django.urls import path
from .views import LoginAPI, Register, UserInfo, ConfirmToken, refresh, UserInfoId, UserInfoUsername

urlpatterns = [
    path("register/", Register.as_view(), name="register"),
    path("login/", LoginAPI.as_view(), name="login"),
    path("user/me/", UserInfo.as_view(), name="User Info"),
    path("user/<str:username>", UserInfoUsername.as_view(), name="User Info Username"),
    path("username/<uuid:id>", UserInfoId.as_view(), name="User Info Id"),
    path("token/", ConfirmToken.as_view(), name="Token"),
    path("refresh", refresh.as_view(), name="Refresh")
]