import os
import json
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

current_dir = Path(__file__).resolve().parent
project_root = current_dir.parent.parent 
env_path = project_root / '.env' 
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def archive_old_interviews():
    print("starting the weekly data archiver...")

    try:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=7)
        cutoff_string = cutoff_date.isoformat()

        print(f" Fetching interviews older than {cutoff_string.split('T')[0]}...")
        
        response = supabase.table('latest_interviews').select('*').lt('created_at', cutoff_string).order('created_at', desc=True).execute()
        old_data = response.data

        if not old_data:
            print(" no week-old data found. Database is already clean.")
            return

        print(f" found {len(old_data)} old rows. Preparing to archive...")

        data_dir = project_root / 'src' / 'data'
        data_dir.mkdir(parents=True, exist_ok=True)
        file_path = data_dir / 'archive.json'

        existing_data = []
        if file_path.exists():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            except json.JSONDecodeError:
                print(" archive.json is empty or invalid. starting a new array.")
                existing_data = []

        existing_data = old_data + existing_data

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=2)
            
        print(f" prepended data locally to archive.json. total records: {len(existing_data)})")

        ids_to_delete = [row['id'] for row in old_data]
        
        delete_response = supabase.table('latest_interviews').delete().in_('id', ids_to_delete).execute()
        print(f" successfully deleted {len(old_data)} rows from Supabase.")

        print("  committing to Git...")
        
        str_file_path = str(file_path)
        
        subprocess.run(['git', 'add', str_file_path], check=True)
        subprocess.run(['git', 'commit', '-m', f"chore(auto-commit): shift {len(old_data)} old interview posts to interview_archive.json"], check=True)
        subprocess.run(['git', 'push'], check=True)
        
        print("git push successful. Archive pipeline complete!")

    except subprocess.CalledProcessError as e:
        print(f"git command failed: {e}")
    except Exception as e:
        print(f"archiver pipeline failed: {e}")

if __name__ == "__main__":
    archive_old_interviews()