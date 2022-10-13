from datetime import datetime
from http import client
from typing import Any, Dict, Tuple

from pymongo import MongoClient

client = MongoClient("localhost", 27017)
db = client.lol_history

DATE_FORMAT = "%d/%m/%Y - %H:%M:%S"
EXPIRATION_TIMEOUT = 60*60  # 1 hour


def did_expire(old_date: datetime, expiration_time: int) -> bool:
    return (datetime.now() - old_date).seconds >= expiration_time


def update_db(key: Dict[str, str], collection: str, new_data: Dict[str, Any]) -> None:
    date = {"last_update": datetime.now()}
    if collection == "players":
        db[collection].update_one(key, {"$set": new_data | date}, upsert=True)
    # if collection == "history":
    #     db[collection].update_one(key, {"$set": key | {"history": new_data} | date}, upsert=True)
    if collection == "matches":
        db[collection].insert_one(key | new_data)


def check_db(collection: str, key: Dict[str, str]) -> Tuple[bool, bool, Dict[str, Any]]:
    entry_not_found = expired = True
    data = db[collection].find_one(key)
    if data:
        entry_not_found = False
        if collection == "matches" or not did_expire(data["last_update"], EXPIRATION_TIMEOUT):
            print(f"{key} fetched from {collection} collection")
            expired = False
        else:
            print(f"Expiration timeout reached on entry {key} of {collection}")
            print("Fetching data from riot games")
    else:
        data = dict()
        print(f"Entry {key} not found in {collection}")
        print("Fetching data from riot games")

    return entry_not_found, expired, data
