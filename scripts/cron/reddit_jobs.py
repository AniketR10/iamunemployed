import praw
import time
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client

# --- 1. Setup & Auth ---
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

# --- 2. Configuration ---
subreddits = ["jobs", "forhire", "RemoteJobs", "startup", "Entrepreneur"]
keywords = ["hiring", "internship", "opening", "remote", "looking for"]

subreddit = reddit.subreddit("+".join(subreddits))
print("🚀 Stream started... Only saving: timestamp, subreddit, title, url")

# --- 3. The Stream Loop ---
for submission in subreddit.stream.submissions(skip_existing=True, pause_after=-1):
    if submission is None:
        continue

    # Filter by keywords
    if not any(k in submission.title.lower() for k in keywords):
        continue

    # --- 4. Prepare EXACTLY the data you requested ---
    data_payload = {
        "timestamp": datetime.fromtimestamp(submission.created_utc).isoformat(),
        "subreddit": submission.subreddit.display_name,
        "title": submission.title.replace("\n", " ").strip(),
        "url": submission.url
    }

    try:
        # Send to Supabase
        supabase.table("redditjobs").upsert(
            data_payload, 
            on_conflict="url" 
        ).execute()
        
        print(f"✅ Saved: {data_payload['title'][:40]}...")

    except Exception as e:
        print(f"❌ DB Error: {e}")