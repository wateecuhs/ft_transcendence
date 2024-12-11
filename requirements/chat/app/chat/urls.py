from django.urls import path
from .views import MessagesView, FriendsView

urlpatterns = [
    path("messages/", MessagesView.as_view()),
    path("friends/<str:username>/", FriendsView.as_view()),
]
