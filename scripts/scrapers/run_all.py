import os
import time
import subprocess
import sys

def run_all_scrapers():

    scrapers = [
        "googlenews.py",
        "healthcareittoday.py",
        "techcrunch.py",
        "theaiinsider.py",
        "thesassnews.py",
        "twitter.py",
    ]

    print(f" Found {len(scrapers)} scripts to run.\n")
    print("="*50)

    success_count = 0
    fail_count = 0
    failed_scripts = []

    for script in scrapers:
        if not os.path.exists(script):
            print(f" File '{script}' not found.")
            fail_count +=1
            failed_scripts.append(script)
            continue

        print(f" Running {script}...")
        start_time = time.time()

        try:
            result  = subprocess.run(
                [sys.executable, script],
                capture_output=False,
                text=True,
                check=True
            )

            duration = round(time.time() - start_time, 2)
            print(f" Finished {script} in {duration}s")
            success_count += 1

        except subprocess.CalledProcessError as e:
            print(f" FAILED: {script} crashed with error code {e.returncode}")
            fail_count += 1
            failed_scripts.append(script)

        except Exception as e:
            print(f" ERROR: Could not run {script}. Reason: {e}")
            fail_count += 1
            failed_scripts.append(script)

        print("-" * 50)

    print("\n" + "="*50)
    print(" JOB COMPLETE")
    print(f" Successful: {success_count}")
    print(f" Failed:     {fail_count}")

    if failed_scripts:
        print("\nScripts that failed:")
        for s in failed_scripts:
            print(f" - {s}")
    print("="*50)

if __name__ == "__main__":
    run_all_scrapers()