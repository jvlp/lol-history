from dotenv import load_dotenv
from os import getenv

load_dotenv()
MONGOPSW = getenv("MONGOPSW")
EXPIRATION_TIMEOUT = 60*60  # 1 hour
HEADER = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": getenv("API_KEY")
}
