import feedparser
from datetime import date, timedelta
import html

def scrape_google_news():
    url = "https://news.google.com/rss/search?q=startup+raised+funding+series&hl=en-IN&gl=IN&ceid=IN:en"
    print(f"coonecting to google news...")

    feed = feedparser.parse(url)
    print(f"fetched {len(feed.entries)} articles.\n")

    today = date.today()

    prev_days = 3
    start_date = today - timedelta(days=prev_days)

    print(f"showing news from: {start_date} to {today}\n")

    for entry in feed.entries:
        if hasattr(entry, 'published_parsed') and entry.published_parsed:
            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)
        else:
            continue

        if article_date >= start_date:

            raw_title = html.unescape(entry.title)
            clean_title = raw_title.rsplit(' - ',1)[0]

            link = entry.link

            print(f"[{article_date}] {clean_title}")
            print(f"Link: {link}")
            print("-" * 50)

if __name__ == "__main__":
    scrape_google_news()