import feedparser
from datetime import date, timedelta
import file_saver

def scrape():
    url = "https://www.healthcareittoday.com/tag/health-it-funding/feed/"

    today = date.today()

    prev_days = 1
    start_date = today - timedelta(days=prev_days)

    print(f"connecting to rss of {url}...")

    feed = feedparser.parse(url, agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

    if not feed.entries:
        print(f" could not fetch feed (or it's empty).")
        return
    
    print(f" found {len(feed.entries)} articles:\n")

    cnt =0
    file_save = []
    seen_links = set()

    for entry in feed.entries:
        if hasattr(entry, 'published_parsed'):
            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

            if article_date == start_date or article_date == today:

                title = entry.title
                link = entry.link

                if link in seen_links:
                    continue

                print(f"title: {title}")
                print(f"link: {link}")
                cnt+=1

                file_save.append({
                    'title': title,
                    'link': link,
                    'date': str(article_date)
                })
                seen_links.add(link)
            
    if cnt > 0:
        print(f"{cnt} articles found for today")
        file_saver.save_common_data("Healthcare IT Today", file_save)
    else:
        print(f"no articles found for today")

if __name__ == "__main__":
    scrape()