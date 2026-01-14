import feedparser
from datetime import date, timedelta
import html
import file_saver

def scrape_google_news():
    url = "https://news.google.com/rss/search?q=startup+raised+funding+series&hl=en-IN&gl=IN&ceid=IN:en"
    print(f"coonecting to google news...")

    feed = feedparser.parse(url)
    print(f"fetched {len(feed.entries)} articles.\n")

    today = date.today()

    prev_days = 1
    start_date = today - timedelta(days=prev_days)

    print(f"showing news from: {start_date} to {today}\n")

    file_save = []
    seen_links = set()

    keywords = ["raised", "funding", "raises", "secured", "secures", "secure", "invested", "invests"]

    for entry in feed.entries:
        if hasattr(entry, 'published_parsed') and entry.published_parsed:
            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)
        else:
            continue

        if article_date >= start_date:

            link = entry.link

            if link in seen_links:
                continue

            raw_title = html.unescape(entry.title)
            if " - " in raw_title:
                clean_title = raw_title.rsplit(' - ', 1)[0]
            else:
                clean_title = raw_title

            if any(k in clean_title.lower() for k in keywords):
                print(f"[{article_date}] {clean_title}")
                print(f"Link: {link}")
                print("-" * 50)

            file_save.append({
                'title': clean_title,
                'link': link,
                'date': str(article_date)
            })
            seen_links.add(link)

    if file_save:
        file_saver.save_common_data("Google News", file_save)
    else:
        print("No recent articles found.")

if __name__ == "__main__":
    scrape_google_news()