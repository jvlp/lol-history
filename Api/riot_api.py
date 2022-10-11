import json
import os
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from requests import get

app = Flask(__name__)
CORS(app)
load_dotenv()

DATE_FORMAT = "%d %m %Y %H:%M:%S"
EXPERIRATION_TIMEOUT = 60*60  # 1 hour

header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": os.getenv("API_KEY")
}


def did_expire(date_string, expiration_time):
    return (datetime.now() - datetime.strptime(date_string, DATE_FORMAT)).seconds >= expiration_time


def is_file_empty(filename):
    return os.path.getsize(filename) == 0


def cache_data(player_name, new_data, cache_file_name):
    cached_data = dict()
    with open(cache_file_name, 'r') as cache_file:
        if not is_file_empty(cache_file_name):
            cached_data = json.load(cache_file)

    with open(cache_file_name, 'w') as f:
        data = {
            player_name: {
                'data': new_data,
                'expires': datetime.now().strftime(DATE_FORMAT),
            },
        }
        cached_data.update(data)
        json.dump(cached_data, f)


def check_cache(file_name, player_name):
    fetch = True
    data = dict()
    try:
        with open(file_name, 'r') as f:
            cached_data = json.load(f)
            # print(player_name in cached_data)
            # print(not did_expire(cached_data[player_name]['expires'], EXPERIRATION_TIMEOUT))
            if player_name in cached_data and not did_expire(cached_data[player_name]['expires'], EXPERIRATION_TIMEOUT):
                print(f"fetched from local {file_name}")
                data = cached_data[player_name]['data']
                fetch = False
            else:
                print("fetching data from riot games")

    except FileNotFoundError as e:
        print(f"{file_name} not found")
        print(f"creating {file_name}")
        with open(file_name, 'w+') as f:
            json.dump({}, f)

    return fetch, data


@app.route("/pname/<player_name>")
def get_player(player_name):

    fetch, player_data = check_cache('player_cache.json', player_name)

    if fetch:
        url = f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{player_name}"
        player_data = get(url, headers=header)

        player_data = player_data.json()
        cache_data(player_name, player_data, "player_cache.json")

    return player_data


def get_match_ids(player_puuid):
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{player_puuid}/ids?start=0&count=20"
    res_match_ids = get(url, headers=header)
    return list(res_match_ids.json())


def get_match(match_id):
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
    res_matchs = get(url, headers=header)
    match = res_matchs.json()
    return match


def setup_response(player, name, match_ids):
    p_name = player["name"]
    p_level = player["summonerLevel"]
    p_icon = player["profileIconId"]
    res = list()
    for id in match_ids:
        match_data = get_match(id)
        participants = match_data['info']['participants']
        match = dict()
        info = dict()
        match["participants"] = list()
        for p in participants:
            if p["summonerName"] == name:
                info.update({
                    "gameDuration": match_data["info"]["gameDuration"],
                    "gameCreation": match_data["info"]["gameStartTimestamp"],
                    "gameMode": match_data["info"]["gameMode"],
                    "win": p["win"],
                    "summonerName": p_name,
                    "summonerLevel": p_level,
                    "profileIconId": p_icon,
                    "championName": p["championName"],
                    "kills": p["kills"],
                    "deaths": p["deaths"],
                    "assists": p["assists"],
                    "championId": p["championId"]
                })

            player = {
                "summonerName": p["summonerName"],
                "championName": p["championName"],
                "kills": p["kills"],
                "deaths": p["deaths"],
                "assists": p["assists"],
                "championId": p["championId"],
            }
            match['participants'].append(player)

        match["info"] = info
        res.append(match)
    return res


@app.route("/last_match/<name>")
def last_match(name):
    player = get_player(name)
    print(player)

    match_ids = get_match_ids(player["puuid"])
    match_data = get_match(match_ids[0])
    return match_data


@app.route("/match_history/<name>")
def match_history(name):
    player = get_player(name)
    print(player)

    fetch, data = check_cache("history_cache.json", name)
    if fetch:
        match_ids = get_match_ids(player["puuid"])
        data = setup_response(player, name, match_ids)
        cache_data(name, data, "history_cache.json")

    return data


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

    # player = dict()
    # player = get_player("Blaymus")
    # print(player)
    # match_ids = get_match_ids(player["puuid"])
    # print(match_ids)
    # match = get_match(match_ids[0])

    # for p in match['info']['participants']:
    #     print(f"{p['summonerName']} - {p['championName']} - {'win' if p['win'] else 'lose'}")
