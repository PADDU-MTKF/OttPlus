from justwatch import JustWatch
import requests
import json
import threading
from datetime import datetime
import time
from pprint import pprint
import os
import pytz
from dotenv import load_dotenv
import random

TZ = pytz.timezone("Asia/Kolkata")

DEVELOPMENT = True

if DEVELOPMENT == True:
    load_dotenv()
    KEY = os.getenv('KEY')
    port = 8888
    debug = True
else:
    KEY = os.environ['KEY']
    port = 8080
    debug = False

Image_Link = "https://image.tmdb.org/t/p/original/"

base_dir = "ott/modules/"

with open(base_dir+'Data/Genres.json', 'r') as f:
    Genres_data = json.load(f)

with open(base_dir+'Data/Provider.json', 'r') as f:
    Provider_data = json.load(f)

with open(base_dir+'Data/Popular_Mix.json', 'r') as f:
    Popular_Mix_data = json.load(f)

with open(base_dir+'Data/Popular_Movies.json', 'r') as f:
    Popular_Movies_data = json.load(f)

with open(base_dir+'Data/Popular_Shows.json', 'r') as f:
    Popular_Shows_data = json.load(f)

with open(base_dir+'Data/LiveTv.json', 'r') as f:
    LiveTV_data = json.load(f)

with open(base_dir+'Data/Popular_LiveTV.json', 'r') as f:
    Popular_LiveTV_data = json.load(f)

with open(base_dir+'Data/API_EndPoints.txt', 'r') as f:
    API_EndPoints_data = f.read()

# Init ****************************************************************************************************************************************************************


just_watch = JustWatch(country='IN', providers=[
                       Provider_data[each]['Short'] for each in Provider_data])


# Main Functions ********************************************************************************************************************************************************

def alternate_data(req_data, Id, cont_type):
    try:
        for each in req_data['scoring']:
            if each['provider_type'] == "imdb:score":
                Rating = each['value']
                break
        else:
            Rating = None
    except:
        Rating = None
    try:
        Img_Poster = "https://images.justwatch.com" + \
            req_data["poster"].replace("{profile}", "s592")
    except:
        Img_Poster = None

    sub_res = just_watch.get_title(title_id=Id, content_type=cont_type)
    try:
        Overview = sub_res['short_description']
    except:
        Overview = None

    try:
        Img_Cover = "https://images.justwatch.com/" + \
            sub_res['backdrops'][0]['backdrop_url'].replace(
                '{profile}', 's1920')
    except:
        Img_Cover = None

    try:
        Genres = []

        genre_ids_list = sub_res['genre_ids']

        genre_details = just_watch.get_genres()
        for each in genre_details:
            if each['id'] in genre_ids_list:
                Genres.append(each['translation'])
                genre_ids_list.remove(each['id'])
            if genre_ids_list == []:
                break

    except:
        Genres = []

    try:
        Certification = sub_res['age_certification']
    except:
        Certification = None

    return Rating, Img_Poster, Img_Cover, Overview, Genres, Certification


def get_details(query=None, providers=None, content_types=['movie', 'show'], page_size=None, genres=None, languages=None, page=None):
    '''
    get popular movies
    get popular show
    get a search result
    '''
    item = just_watch.search_for_item(
        query=query, providers=providers, content_types=content_types, page_size=page_size, genres=genres, languages=languages, page=page)
    # .get_title(title_id=103561)

    Movie_List = {}
    for req_data in item['items']:
        #req_data = item['items'][0]
        # pprint(req_data)

        Id = req_data['id']
        Title = req_data['title']
        cont_type = req_data['object_type']

        try:
            Release_Year = req_data['original_release_year']
        except:
            Release_Year = None

        Stream_Link = []
        try:
            P_data = Provider_data
            temp2 = []
            for each in req_data['offers']:
                temp = {}

                if each['monetization_type'] not in ['buy', 'rent'] and each['urls']['standard_web'] not in temp2:
                    temp['Link'] = each['urls']['standard_web']
                    temp2.append(each['urls']['standard_web'])
                    p_id = str(each['provider_id'])

                    try:
                        temp['Provider'] = P_data[p_id]['Name']
                        temp['Provider_Logo'] = P_data[p_id]['Logo']
                    except:
                        continue

                    Stream_Link.append(temp)

        except:
            try:
                sub_res = just_watch.get_title(
                    title_id=Id, content_type=cont_type)
                try:
                    Release_Year = sub_res['original_release_year']
                except:
                    Release_Year = None
                try:

                    P_data = Provider_data
                    temp2 = []
                    for each in sub_res['offers']:
                        temp = {}

                        if each['monetization_type'] not in ['buy', 'rent'] and each['urls']['standard_web'] not in temp2:
                            temp['Link'] = each['urls']['standard_web']
                            temp2.append(each['urls']['standard_web'])
                            p_id = str(each['provider_id'])

                            try:
                                temp['Provider'] = P_data[p_id]['Name']
                                temp['Provider_Logo'] = P_data[p_id]['Logo']
                            except:
                                continue

                            Stream_Link.append(temp)

                except:
                    Stream_Link = []
            except:
                Stream_Link = []

        # pprint(req_data['scoring'])
        for each in req_data['scoring']:
            if each['provider_type'] == "tmdb:id":
                Tmdb_ID = each['value']
                break
        else:
            try:
                sub_res = just_watch.get_title(
                    title_id=Id, content_type=cont_type)
                for each in sub_res['external_ids']:
                    if each['provider'] == 'tmdb':
                        Tmdb_ID = each['external_id']
                        break
                else:
                    Tmdb_ID = None
            except:
                Tmdb_ID = None

        Rating, Img_Poster, Img_Cover, Overview, Genres, Certification = alternate_data(
            req_data, Id, cont_type)

        if Certification is None:
            try:
                try:
                    if cont_type == 'movie':
                        tmdb_API = f"https://api.themoviedb.org/3/movie/{Tmdb_ID}/release_dates?api_key={KEY}"
                        response = requests.request(
                            "GET", tmdb_API)
                        data = response.json()
                        re = data['results']
                        for each in re:
                            if each['iso_3166_1'] == 'IN' and each['release_dates'][0]['certification'] != "":
                                Certification = each['release_dates'][0]['certification']
                                break
                        else:
                            if re[0]['release_dates'][0]['certification'] not in ['0', '']:
                                Certification = re[0]['release_dates'][0]['certification']

                    elif cont_type == 'show':
                        tmdb_API = f"https://api.themoviedb.org/3/tv/{Tmdb_ID}/content_ratings?api_key={KEY}"
                        response = requests.request(
                            "GET", tmdb_API)
                        data = response.json()
                        re = data['results']
                        for each in re:
                            if each['iso_3166_1'] == 'IN' and each['release_dates'][0]['certification'] != "":
                                Certification = each['release_dates'][0]['certification']
                                break
                        else:
                            if re[0]['release_dates'][0]['certification'] not in ['0', '']:
                                Certification = re[0]['release_dates'][0]['certification']
                    if Certification is None:
                        raise Exception

                except:
                    try:
                        just_watch_default = JustWatch(country='AU')
                        def_res = just_watch_default.get_title(
                            title_id=Id, content_type=cont_type)
                        Certification = def_res['age_certification']
                    except:
                        Certification = None
            except:
                Certification = None

        try:
            results = just_watch.get_title(title_id=Id, content_type=cont_type)
            Total_Seasons = None
            if cont_type.lower() == 'show':
                Total_Seasons = len(results['seasons'])
                raise Exception

            r_temp = results['runtime']
            hr = mn = 0
            while r_temp >= 60:
                r_temp -= 60
                hr += 1
            mn = r_temp
            Runtime = f"{hr}h {mn}m"
        except:
            Runtime = None

        Movie_data = {'Id': Id,
                      'Title': Title,
                      'Content_Type': cont_type,
                      'Total_Seasons': Total_Seasons,
                      'Certification': Certification,
                      'Release_Year': Release_Year,
                      'Rating': Rating,
                      'Runtime': Runtime,
                      'Genres': Genres,
                      'Watch': Stream_Link,
                      'Poster': Img_Poster,
                      'Cover': Img_Cover,
                      'Owerview': Overview
                      }

        Movie_List[Id] = Movie_data

    if query is None and page_size is None and providers is None and genres is None and languages is None:
        if content_types == ['movie', 'show']:
            with open(base_dir+"Data/Popular_Mix.json", 'w') as f:
                json.dump(Movie_List, f, indent=4)

        elif content_types == ['movie']:
            with open(base_dir+"Data/Popular_Movies.json", 'w') as f:
                json.dump(Movie_List, f, indent=4)

        elif content_types == ['show']:
            with open(base_dir+"Data/Popular_Shows.json", 'w') as f:
                json.dump(Movie_List, f, indent=4)

    return Movie_List


# ****************************************************************************************************************************************************************

def update_popular():
    global Popular_Shows_data, Popular_Mix_data, Popular_Movies_data
    while True:
        time.sleep(0.02)
        now_hr = datetime.now(TZ).strftime('%H')
        print('checking...')
        if now_hr == '00':
            print('Updating....')

            t1 = threading.Thread(target=lambda: get_details(
                content_types=['show']))
            t2 = threading.Thread(target=lambda: get_details(
                content_types=['movie']))
            t3 = threading.Thread(target=lambda: get_details())

            t1.start()
            t2.start()
            t3.start()
            t1.join()
            t2.join()
            t3.join()

            print('Update Done....')

            with open(base_dir+'Data/Popular_Mix.json', 'r') as f:
                Popular_Mix_data = json.load(f)

            with open(base_dir+'Data/Popular_Movies.json', 'r') as f:
                Popular_Movies_data = json.load(f)

            with open(base_dir+'Data/Popular_Shows.json', 'r') as f:
                Popular_Shows_data = json.load(f)

            with open(base_dir+'Data/Update_log.txt', 'w') as f:
                updated_time = str(datetime.now(TZ))
                text = f"Last Updated :-  {updated_time}"
                f.write(text)

            # task
        time.sleep(1800)


data_search = {}


def get_search_god(query, providers, content_types, genres, languages, i):
    global data_search
    data_search.update(get_details(query=query, providers=providers, content_types=content_types,
                       genres=genres, languages=languages, page_size=5, page=i+1))


def start_search_god(query=None, providers=None, content_types=['movie', 'show'], genres=None, languages=None):
    global data_search
    data_search = {}
    temp = {}
    for i in range(20):
        temp[i] = threading.Thread(target=lambda: get_search_god(
            query, providers, content_types, genres, languages, i))
        temp[i].start()
    for i in range(20):
        temp[i].join()

    return data_search


threading.Thread(target=update_popular, daemon=True).start()


# Flask Code ****************************************************************************************************************************************************************


# @app.route('/get_genres_info')
def genres():
    return (Genres_data)


# @app.route('/popular_movies/')
def movie():
    keys = []
    keys = list(Popular_Movies_data.keys())
    # print(keys)
    random.shuffle(keys)
    # print(keys)
    data = dict()
    for key in keys:
        data.update({key: Popular_Movies_data[key]})

    return (data)


# @app.route('/popular_show/')
def show():
    keys = []
    keys = list(Popular_Shows_data.keys())
    random.shuffle(keys)
    data = dict()
    for key in keys:
        data.update({key: Popular_Shows_data[key]})
    return (data)


# @app.route('/popular_mix/')
def mix():
    keys = []
    keys = list(Popular_Mix_data.keys())
    random.shuffle(keys)
    data = dict()
    for key in keys:
        data.update({key: Popular_Mix_data[key]})
    return (data)


# @app.route('/popular_livetv/')
def poplive():
    keys = []
    keys = list(Popular_LiveTV_data.keys())
    random.shuffle(keys)
    data = dict()
    for key in keys:
        data.update({key: Popular_LiveTV_data[key]})
    # print(data)
    return (data)


# @app.route('/get_livetv')
def livetv():
    return (LiveTV_data)


# @app.route('/genres/<string:gen>')
def genre(gen):
    temp = []
    temp.append(gen)
    return (start_search_god(genres=temp))


# @app.route('/search_box/<string:search>')
def Search_box(search):
    return (get_details(query=search, page_size=3))


# @app.route('/search/<string:search>')
def Search(search):
    return (start_search_god(query=search))


# # @app.route('/god_mode')
# def GodMode():
#     query = request.args.get('query') if 'query' in request.args else None
#     providers = eval(request.args.get(
#         'providers')) if 'providers' in request.args else None
#     content_types = eval(request.args.get(
#         'content_types')) if 'content_types' in request.args else ['movie', 'show']
#     genres = eval(request.args.get('genres')
#                   ) if 'genres' in request.args else None
#     languages = eval(request.args.get(
#         'languages')) if 'languages' in request.args else None

#     #print(query, providers, content_types, genres, languages)
#     return (start_search_god(query=query, providers=providers, content_types=content_types, genres=genres, languages=languages))
