"""ottplus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ott import views


urlpatterns = [
    path('', views.home, name="home"),
    path('home', views.home, name="home"),
    path('content', views.content, name="content"),
    path('livetv', views.livetv, name="livetv"),
    path('genres', views.gen_search, name="genres"),
    path('search', views.gen_search, name="search"),

    path('api/popular_movies', views.popular_movies, name="popular_movies"),
    path('api/popular_show', views.popular_show, name="popular_show"),
    path('api/popular_mix', views.popular_mix, name="popular_mix"),
    path('api/popular_livetv', views.popular_livetv, name="popular_livetv"),
    path('api/get_livetv', views.get_livetv, name="get_livetv"),
]
