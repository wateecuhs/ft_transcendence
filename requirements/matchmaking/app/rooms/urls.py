from .views import RoomsView, RoomView, TournamentsView
from django.urls import path

urlpatterns = [
    path("rooms/", RoomsView.as_view()),
    path("rooms/<str:name>/", RoomView.as_view()),
    path("tournaments/", TournamentsView.as_view()),
]