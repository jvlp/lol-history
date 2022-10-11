import json
import os
from datetime import datetime
from typing import Any, Dict, List, Tuple
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from requests import get
from pprint import pprint

app = Flask(__name__)
CORS(app)
load_dotenv()

DATE_FORMAT = "%d/%m/%Y - %H:%M:%S"
EXPIRATION_TIMEOUT = 60*60  # 1 hour
PLAYER_CACHE = 'player_cache.json'
HISTORY_CACHE = 'history_cache.json'

header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": os.getenv("API_KEY")
}


def did_expire(date_string: str, expiration_time: int) -> bool:
    return (datetime.now() - datetime.strptime(date_string, DATE_FORMAT)).seconds >= expiration_time


def cache_data(player_name: str, cache_file_name: str, new_data: Dict[str, Any] | List[Dict[str, Any]], match_ids: List[str] = []) -> Dict[str, Any] | List[Dict[str, Any]]:
    
    cached_data = dict()
    with open(cache_file_name, 'r') as cache_file:
        cached_data = json.load(cache_file)

    with open(cache_file_name, 'w') as f:
        new_entry = dict()
        if cache_file_name == PLAYER_CACHE or player_name not in cached_data:
            print('player cache')
            new_entry = {
                player_name: {
                    'data': new_data,
                    'match_ids': match_ids,
                    'last_update': datetime.now().strftime(DATE_FORMAT),
                },
            }
        else:
            print('history cache')
            new_entry = {
                player_name: {
                    'data': [*cached_data[player_name]['data'], *new_data],
                    'match_ids': match_ids,
                    'last_update': datetime.now().strftime(DATE_FORMAT),
                },
            }

        cached_data = cached_data | new_entry
        json.dump(cached_data, f)
        return cached_data[player_name]['data']


def check_cache(file_name: str, player_name: str) -> Tuple[bool, bool, Dict[str, Any]]:
    entry_not_found = expired = True
    data = dict()
    try:
        with open(file_name, 'r') as f:
            cached_data = json.load(f)
            if player_name in cached_data:
                entry_not_found = False
                if not did_expire(cached_data[player_name]['last_update'], EXPIRATION_TIMEOUT):
                    print(f"fetched from local {file_name}")
                    data = cached_data[player_name]
                    expired = False
                else:
                    print(
                        f"Expiration timeout reached on entry {player_name} of {file_name}")
                    print("Fetching data from riot games")
            else:
                print(f"Entry {player_name} not found in {file_name}")
                print("Fetching data from riot games")

    except FileNotFoundError as e:
        print(f"{file_name} not found")
        print(f"creating {file_name}")
        with open(file_name, 'w+') as f:
            json.dump({}, f)

    return entry_not_found, expired, data


@app.route("/pname/<player_name>")
def get_player(player_name: str) -> Dict[str, Any]:

    entry_not_found, expired, data = check_cache(PLAYER_CACHE, player_name)

    if entry_not_found or expired:
        url = f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{player_name}"
        player_data = get(url, headers=header)

        player_data = player_data.json()
        cache_data(player_name, PLAYER_CACHE, player_data)
    else:
        player_data = data["data"]

    return player_data


def get_match_ids(player_puuid: str) -> List[str]:
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{player_puuid}/ids?start=0&count=20"
    res_match_ids = get(url, headers=header)
    return list(res_match_ids.json())


def get_match(match_id: str) -> Dict[str, Any]:
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
    res_matchs = get(url, headers=header)
    match = res_matchs.json()
    return match


def setup_response(player: Dict[str, Any], player_name: str, match_ids: List[str]) -> List[Dict[str, Any]]:
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
            if p["summonerName"] == player_name:
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
def last_match(name: str) -> Dict[str, Any]:
    player = get_player(name)
    print(player)

    match_ids = get_match_ids(player["puuid"])
    match_data = get_match(match_ids[0])
    return match_data


@app.route("/match_history/<name>")
def match_history(name: str) -> List[Dict[str, Any]] | Dict[str, Any]:
    print(request)

    player = get_player(name)
    print(player)

    entry_not_found, expired, data = check_cache(HISTORY_CACHE, name)

    if entry_not_found or expired:
        match_ids = get_match_ids(player["puuid"])

        if not entry_not_found:
            match_ids_cache = data['match_ids']
            new_match_ids = [id for id in match_ids if id not in match_ids_cache]
        else:
            new_match_ids = match_ids

        history_data = setup_response(player, name, new_match_ids)
        data = cache_data(name, "history_cache.json", history_data, match_ids)

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
