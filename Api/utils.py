import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from requests import get

from mongo import check_db, update_db

load_dotenv()

DATE_FORMAT = "%d/%m/%Y - %H:%M:%S"
EXPIRATION_TIMEOUT = 60*60  # 1 hour
HEADER = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": os.getenv("API_KEY")
}


def get_player(player_name: str) -> Dict[str, Any]:
    entry_not_found, expired, player = check_db("players", {"name": player_name})

    if entry_not_found or expired:
        url = f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{player_name}"
        player = get(url, headers=HEADER)
        player = player.json()
        update_db({"name": player_name}, "players", player)

    return player


def get_match_ids(player_puuid: str) -> List[str]:
    url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{player_puuid}/ids?start=0&count=20"
    res_match_ids = get(url, headers=HEADER)
    return list(res_match_ids.json())


def get_match(match_id: str) -> Dict[str, Any]:
    entry_not_found, _, match = check_db("matches", {"matchId": match_id})

    if entry_not_found:
        url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
        res_matchs = get(url, headers=HEADER)
        match = res_matchs.json()
        update_db({"matchId": match_id}, "matches", match)

    return match["info"]


def setup_response(player: Dict[str, Any], player_name: str, match_ids: List[str]) -> List[Dict[str, Any]]:
    p_name = player["name"]
    p_level = player["summonerLevel"]
    p_icon = player["profileIconId"]
    res = list()
    for id in match_ids:
        match_data = get_match(id)
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
                })

            player = {
                "summonerName": p["summonerName"],
                "championName": p["championName"],
                "championId": p["championId"],
            }
            match["participants"].append(player)

        match["info"] = info
        res.append(match)

    return res


def get_match_history(player_name: str) -> List[Dict[str, Any]]:
    player = get_player(player_name)
    print(player)

    match_ids = get_match_ids(player["puuid"])
    history = setup_response(player, player_name, match_ids)

    return history
