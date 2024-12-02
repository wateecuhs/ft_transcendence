from .views import RoomsView, RoomView
from django.urls import path

urlpatterns = [
    path("rooms/", RoomsView.as_view()),
    path("rooms/<str:label>/", RoomView.as_view()),
]