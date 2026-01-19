import feedparser
import os
import requests
import re
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client
from time import mktime

script_dir = Path(__file__).resolve().parent
env_path = script_dir.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

subreddits = ["jobs", "forhire", "RemoteJobs", "startup", "Entrepreneur", "WebDeveloperJobs", "DeveloperJobs", "StartupIndia"]
rss_url = f"https://www.reddit.com/r/{'+'.join(subreddits)}/new/.rss?limit=100"

keywords = ["hiring", "internship", "opening", "remote", "job alert"]
exclude = {
    "hiring": ["for hire", "looking for work", "is anyone", "feels"],
    "internship": ["looking for", "for hire", "seeking for", "seeking", "need"],
    "remote": ["for hire", "looking for", "need", "seeking", "seeking for"],
    "opening": ["for hire"],
}

def validate_post(title):
    title_lower = title.lower()
    if not any(k in title_lower for k in keywords):
        return False
    for trigger_word, forbidden_phases in exclude.items():
        if trigger_word in title_lower:
            if any(bad_phrase in title_lower for bad_phrase in forbidden_phases):
                return False
    return True

def run_job_scraper():
    print(f"Fetching rss feed: {rss_url}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(rss_url, headers=headers, timeout=20)
        if response.status_code != 200:
            print(f"error:{response.status_code}")
            return

        feed = feedparser.parse(response.content)
        print(f"Found {len(feed.entries)} entries in feed.")

        for entry in feed.entries:
            title = entry.title
            link = entry.link
            
            if not validate_post(title):
                continue
            
            subreddit_name = "unknown"
            if hasattr(entry, 'category'):
                 subreddit_name = entry.category
            elif "/r/" in link:
                try:
                    subreddit_name = link.split("/r/")[1].split("/")[0]
                except:
                    subreddit_name = "unknown"

            try:
                if hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                    dt_struct = entry.updated_parsed
                elif hasattr(entry, 'published_parsed') and entry.published_parsed:
                    dt_struct = entry.published_parsed
                else:
                    dt_struct = None

                if dt_struct:
                    timestamp = datetime.fromtimestamp(mktime(dt_struct)).isoformat()
                else:
                    timestamp = datetime.now().isoformat()
            except Exception as e:
                timestamp = datetime.now().isoformat()

            data_payload = {
                "timestamp": timestamp,
                "subreddit": subreddit_name,
                "title": title.replace("\n", " ").strip(),
                "url": link
            }

            try:
                supabase.table("redditjobs").upsert(
                    data_payload, 
                    on_conflict="url" 
                ).execute()
            except Exception as db_error:
                print(f" db Error: {db_error}")

    except Exception as e:
        print(f" Error fetching feed: {e}")

    print("Script finished.")

if __name__ == "__main__":
    run_job_scraper()