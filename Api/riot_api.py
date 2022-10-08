from flask import Flask
from flask_cors import CORS
from requests import get
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": os.getenv("API_KEY")
}

def get_player(player_name):
    res_player = get(
        f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{player_name}", headers=header)
    return res_player.json()


def get_match_ids(player_puuid):
    res_match_ids = get(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{player_puuid}/ids?start=0&count=20", headers=header)
    return list(res_match_ids.json())


def get_match(match_id):
    res_matchs = get(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=header)
    match = res_matchs.json()
    return match


@app.route("/match_history/<name>")
def last_match(name):
    player = get_player(name)
    print(player)
    match_ids = get_match_ids(player["puuid"])

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
                    "championName": p["championName"],
                    "kills": p["kills"],
                    "deaths": p["deaths"],
                    "assists": p["assists"],
                })

            player = {
                "summonerName": p["summonerName"],
                "championName": p["championName"],
                "kills": p["kills"],
                "deaths": p["deaths"],
                "assists": p["assists"],
            }
            match['participants'].append(player)

        
        match["info"] = info
        res.append(match)
    return res

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
