from django.urls import path
from rest_framework.views import APIView
from .views import LoginAPI, Register, UserInfo, ConfirmToken, refresh, UserInfoId, UserInfoUsername, MatchHistory, MatchHistoryId, MatchHistoryUsername

urlpatterns = [
    path("register/", Register.as_view(), name="register"),
    path("login/", LoginAPI.as_view(), name="login"),
    path("user/me/", UserInfo.as_view(), name="User Info"),
    path("user/<str:username>", UserInfoUsername.as_view(), name="User Info Username"),
    path("username/<uuid:id>", UserInfoId.as_view(), name="User Info Id"),
    path("token/", ConfirmToken.as_view(), name="Token"),
    path("refresh", refresh.as_view(), name="Refresh"),
    path("match_history/me", MatchHistory.as_view(), name="Match History"),
    path("match_history/<str:username>", MatchHistoryUsername.as_view(), name="Match History Username"),
    path("match_history/<uuid:id", MatchHistoryId.as_view(), name="Match History Id")
]