from django.urls import path

from . import views

urlpatterns = [
    path("progress/", views.createprogress.as_view()),
    path("progress/stop/", views.stopAndStartProgress.as_view()),
    path("fixed/", views.createFixed.as_view()),
]
