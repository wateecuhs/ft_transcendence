from .views import TournamentsView
from django.urls import path

urlpatterns = [
    path("tournaments/", TournamentsView.as_view()),
]