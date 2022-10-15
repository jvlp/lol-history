from datetime import datetime
from typing import Any, Dict, Tuple

from pymongo import MongoClient
from pymongo.errors import WriteError

from constants import EXPIRATION_TIMEOUT

client = MongoClient("localhost", 27017)
db = client.lol_history


def did_expire(old_date: datetime, expiration_time: int) -> bool:
    return (datetime.now() - old_date).seconds >= expiration_time


def update_db(key: Dict[str, str], collection: str, new_data: Dict[str, Any]) -> Dict[str, Any] | None:
    date = {"last_update": datetime.now()}
    try:
        if collection == "players":
            db[collection].update_one(key, {"$set": new_data | date}, upsert=True)
        if collection == "matches":
            db[collection].insert_one(key | new_data)

        print(f"new entry {key} saved in {collection} collection successfully")
        return new_data
    except WriteError as e:
        print(e)
        return None


def check_db(collection: str, key: Dict[str, str]) -> Tuple[bool, Dict[str, Any]]:
    # entry_not_found = expired = False
    fetch = False
    data = db[collection].find_one(key)

    if data is None:
        data = dict()
        # entry_not_found = True
        fetch = True
        print(f"Entry {key} not found in {collection}")
        print("Fetching data from riot games")
        return fetch, data

    elif collection != "matches" and did_expire(data["last_update"], EXPIRATION_TIMEOUT):
        print(f"Key {key} of {collection} collection expired")
        print("Fetching data from riot games")
        # expired = True
        fetch = True
        return fetch, data

    print(f"{key} fetched from {collection} collection")
    return fetch, data
