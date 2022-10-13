from typing import Any, Dict, List
from flask import Flask, request
from flask_cors import CORS
from utils import *

app = Flask(__name__)
CORS(app)


@app.route("/pname/<player_name>")
def player(player_name: str) -> Dict[str, Any]:
    print(request)
    return get_player(player_name)


@app.route("/match/<match_id>")
def match(match_id: str) -> Dict[str, Any]:
    print(request)
    return get_match(match_id)


@app.route("/last_match/<name>")
def last_match(name: str) -> Dict[str, Any]:
    print(request)
    player = get_player(name)
    print(player)

    match_ids = get_match_ids(player["puuid"])
    match_data = get_match(match_ids[0])
    return match_data


@app.route("/match_history/<player_name>")
def match_history(player_name: str) -> List[Dict[str, Any]]:
    print(request)
    return get_match_history(player_name)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

    # player = dict()
    # player = get_player("Blaymus")
    # print(player)
    # match_ids = get_match_ids(player["puuid"])
    # print(match_ids)
    # match = get_match(match_ids[0])

    # for p in match["info"]["participants"]:
    #     print(f"{p["summonerName"]} - {p["championName"]} - {"win" if p["win"] else "lose"}")
