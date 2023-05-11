from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.template.loader import render_to_string
import json
from ott.modules import mymodule
# Create your views here.


def home(request):
    return render(request, 'home.html')


def content(request):
    ID = request.GET.get('ID')
    drag_count = request.GET.get('drag_count')
    data = {'ID': ID, 'drag_count': drag_count}
    return render(request, 'content_page.html', data)


def livetv(request):
    return render(request, 'live_tv_page.html')


def gen_search(request):
    what = request.GET.get('what')
    which = request.GET.get('which')
    data = {'what': what, 'which': which}
    return render(request, 'gen_search_page.html', data)


def popular_movies(request):
    data = mymodule.movie()
    return JsonResponse(data)


def popular_show(request):
    data = mymodule.show()
    return JsonResponse(data)


def popular_mix(request):
    data = mymodule.mix()
    return JsonResponse(data)


def popular_livetv(request):
    data = mymodule.poplive()
    return JsonResponse(data)


def get_livetv(request):
    data = mymodule.livetv()
    return JsonResponse(data)
