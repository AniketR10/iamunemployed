import http.client
import json
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path
import file_saver

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("X_RAPIDAPI_KEY")

json_data = []

conn = http.client.HTTPSConnection("twitter154.p.rapidapi.com")

headers = {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': "twitter154.p.rapidapi.com"
}

conn.request("GET", "/user/tweets?username=StartupReport&limit=3&include_replies=false&include_pinned=false", headers=headers)

res = conn.getresponse()
data = res.read()
json_data = json.loads(data)

today = datetime.now(timezone.utc).date()
prev_days = 0
start_date = today - timedelta(days=prev_days)


# print(type(json_data))
# print(json_data)

tweets = []

for tweet in json_data["results"]:

    tweet_date = datetime.strptime(
        tweet["creation_date"],
        "%a %b %d %H:%M:%S %z %Y"
    ).date()

    if tweet_date == start_date:
        tweets.append({
            "date": tweet.get("creation_date"),

            "title": tweet.get("text"),
            "link": tweet.get("expanded_url")
        })

if tweets:
    print(f" Found {len(tweets)} tweets.")
    file_saver.save_common_data("Twitter (StartupReport)", tweets)
else:
    print(f"No tweets found for {start_date}.")
