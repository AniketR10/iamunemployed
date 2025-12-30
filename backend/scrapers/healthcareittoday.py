import feedparser
from datetime import date

def scrape():
    url = "https://www.healthcareittoday.com/tag/health-it-funding/feed/"

    today = date.today()
    print(f"connecting to rss of {url}...")

    feed = feedparser.parse(url, agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

    if not feed.entries:
        print(f" could not fetch feed (or it's empty).")
        return
    
    print(f" found {len(feed.entries)} articles:\n")

    cnt =0

    for entry in feed.entries:
        if hasattr(entry, 'published_parsed'):
            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

            if article_date == today:

                title = entry.title
                link = entry.link

                print(f"title: {title}")
                print(f"link: {link}")
                cnt+=1
            
    if cnt > 0:
        print(f"{cnt} articles found for today")
    else:
        print(f"no articles found for today")

if __name__ == "__main__":
    scrape()