from django.urls import path
from .views import loginAPI, register, EditAccount, confirm_token, get_user_info, refresh

urlpatterns = [
    path("Register/", register.as_view(), name="register"),
    path("Login/", loginAPI.as_view(), name="login"),
    path("EditAccount/", EditAccount.as_view(), name="Edit Account"),
    path("ConfirmToken/", confirm_token.as_view(), name="Confirm Token"),
    path("GetUserInfo/", get_user_info.as_view(), name="Get User Info"),
    path("Refresh/", refresh.as_view(), name="Refresh")
]