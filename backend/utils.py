from threading import Thread
from time import sleep
from typing import Any, Dict, List

import requests
from requests.structures import CaseInsensitiveDict

import mongo
from constants import HEADER

# global variable to get threads return
setup_match_thread_return: List[Dict[str, Any]] = [{} for _ in range(0, 100)]


def handle_rate_limit(header: CaseInsensitiveDict[str]) -> bool:
    if "Retry-After" in header:
        retry_after = (int(header['Retry-After']) + 1)
        print(f"API rate limit exceeded, waiting {retry_after}s to try again")
        sleep(retry_after)
        return True
    return False


def get_player(player_name: str) -> Dict[str, Any]:
    fetch, player_data = mongo.check_db(
        "players", {"name": player_name})

    if fetch:
        url = f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{player_name}"
        player_data = requests.get(url, headers=HEADER)
        if handle_rate_limit(player_data.headers):
            player_data = requests.get(url, headers=HEADER)
        player_data = player_data.json()
        mongo.update_db({"name": player_name}, "players", player_data)

    return player_data


def get_match_ids(player_puuid: str) -> List[str]:
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{player_puuid}/ids?start=0&count=20"
    res_match_ids = requests.get(url, headers=HEADER)
    if handle_rate_limit(res_match_ids.headers):
        res_match_ids = requests.get(url, headers=HEADER)
    return list(res_match_ids.json())


def get_match(match_id: str) -> Dict[str, Any]:
    fetch, match_data = mongo.check_db("matches", {"matchId": match_id})

    if fetch:
        url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
        res_matchs = requests.get(url, headers=HEADER)

        if handle_rate_limit(res_matchs.headers):
            res_matchs = requests.get(url, headers=HEADER)

        match_data: Dict[str, Any] = res_matchs.json()
        if not mongo.update_db({"matchId": match_id}, "matches", match_data):
            return match_data  # bad request
    return match_data["info"]


def setup_history(player: Dict[str, Any], player_name: str, match_ids: List[str]) -> List[Dict[str, Any]]:
    threads = [Thread(target=setup_match, args=(
        player, player_name, id, i)) for i, id in enumerate(match_ids)]

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    global setup_match_thread_return
    res = list(filter(lambda a: a != {}, setup_match_thread_return))
    setup_match_thread_return = [{} for _ in range(0, 100)]

    return res


def setup_match(player: Dict[str, Any], player_name: str, id: str, index: int) -> None:
    p_name = player["name"]
    p_level = player["summonerLevel"]
    p_icon = player["profileIconId"]

    match_data = get_match(id)
    if "participants" not in match_data:
        return None
    participants = match_data["participants"]
    match = dict()
    info = dict()
    match["participants"] = list()

    for p in participants:
        if p["summonerName"] == player_name:
            info.update({
                "gameDuration": match_data["gameDuration"],
                "gameCreation": match_data["gameStartTimestamp"],
                "queueId": match_data["queueId"],
                "win": p["win"],
                "summonerName": p_name,
                "summonerLevel": p_level,
                "profileIconId": p_icon,
                "kills": p["kills"],
                "deaths": p["deaths"],
                "assists": p["assists"],
                "championId": p["championId"],
                "championName": p["championName"],
                "items": [p["item0"], p["item1"], p["item2"], p["item3"], p["item4"], p["item5"]],
                "cs": p["totalMinionsKilled"],
                "totalDamageDealt": p["totalDamageDealtToChampions"],
                "matchId": id,
                "perks": p["perks"],
            })

        player = {
            "summonerName": p["summonerName"],
            "championName": p["championName"],
            "championId": p["championId"],
        }
        match["participants"].append(player)

    match["info"] = info
    setup_match_thread_return[index] = match


def get_match_history(player_name: str) -> List[Dict[str, Any]]:
    player = get_player(player_name)
    print(player)

    match_ids = get_match_ids(player["puuid"])
    history = setup_history(player, player_name, match_ids)

    return history
