"""
URL configuration for analyzerbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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

from visualizer.views import (upload_files, get_chart_data, get_feature_list, register, login, create_init_tables, save_dashboard_preferences,
                              getDatasetList, getLinechartData, getBarChartData, get_dashboard_data)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("register/", register),
    path("login/", login),
    path("uploadfiles/", upload_files),
    path("getchartdata", get_chart_data),
    path("getfeaturelist", get_feature_list),
    path('createinittables', create_init_tables),
    path('savedashboardpref/', save_dashboard_preferences),
    path('getdatasetlist/', getDatasetList),
    path('getlinechartdata', getLinechartData),
    path('getbarchartdata', getBarChartData),
    path('getdashboarddata', get_dashboard_data)
]
