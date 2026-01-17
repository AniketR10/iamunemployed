import praw
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client

script_dir = Path(__file__).resolve().parent
env_path = script_dir.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT"),
)

subreddits = ["jobs", "forhire", "RemoteJobs", "startup", "Entrepreneur", "WebDeveloperJobs", "DeveloperJobs", "StartupIndia"]
subreddit = reddit.subreddit("+".join(subreddits))

keywords = ["hiring", "internship", "opening", "remote", "job alert"]
exclude = {
    "hiring": ["for hire", "looking for work", "is anyone", "feels",],
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
    print(f"Fetching latest posts from: {subreddits}")
    

    for submission in subreddit.new(limit=100):

        if not validate_post(submission.title):
            continue
        
        if not any(k in submission.title.lower() for k in keywords):
            continue

        raw_url = submission.url

        if not raw_url.startswith("https://www.reddit.com"):
            continue


        data_payload = {
            "timestamp": datetime.fromtimestamp(submission.created_utc).isoformat(),
            "subreddit": submission.subreddit.display_name,
            "title": submission.title.replace("\n", " ").strip(),
            "url": raw_url
        }

        try:
            supabase.table("redditjobs").upsert(
                data_payload, 
                on_conflict="url" 
            ).execute()
            
        except Exception as e:
            print(f"❌ DB Error: {e}")

    print("✅ Sync complete. Script finished.")

if __name__ == "__main__":
    run_job_scraper()