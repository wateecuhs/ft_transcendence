from django.urls import path
from rest_framework.views import APIView
from .views import LoginAPI, Register, UserInfo, ConfirmToken, refresh, UserInfoId, UserInfoUsername, MatchHistory, MatchHistoryId, MatchHistoryUsername, UserStat, UserStatId, UserStatUsername, Api42, Activate2FA, Desactivate2FA, Verify2FA

urlpatterns = [
    path("register/", Register.as_view(), name="register"),
    path("login/", LoginAPI.as_view(), name="login"),
    path("user/me/", UserInfo.as_view(), name="User Info"),
    path("user/<uuid:id>/", UserInfoId.as_view(), name="User Info Id"),
    path("user/<str:username>/", UserInfoUsername.as_view(), name="User Info Username"),
    path("token/", ConfirmToken.as_view(), name="Token"),
    path("refresh/", refresh.as_view(), name="Refresh"),
    path("matches/me/", MatchHistory.as_view(), name="Match History"),
    path("matches/<uuid:id>/", MatchHistoryId.as_view(), name="Match History Id"),
    path("matches/<str:username>/", MatchHistoryUsername.as_view(), name="Match History Username"),
    path("statistics/me/", UserStat.as_view(), name="User Statistics"),
    path("statistics/<uuid:id>/", UserStatId.as_view(), name="User Statistics Id"),
    path("statistics/<str:username>/", UserStatUsername.as_view(), name="User Statistics Username"),
    path("access/", Api42.as_view(), name="Api 42"),
    path("2FA/activate/", Activate2FA.as_view(), name="Activate 2FA"),
    path("2FA/verify/", Verify2FA.as_view(), name="Verify 2FA"),
    path("2FA/desactivate/", Desactivate2FA.as_view(), name="Desactivate 2FA")
]