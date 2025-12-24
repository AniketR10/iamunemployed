import feedparser
import re
import html
from datetime import date, timedelta

def scrape_tc_startups():
    urls = [
        "https://techcrunch.com/category/startups/feed/",
        "https://techcrunch.com/category/venture/feed/"
    ]

    
    today = date.today()
    yesterday = today - timedelta(days=1)
    print(f"fetching articles btw {yesterday} and {today}")

    for url in urls:
        print(f"parsing from feed: {url}")
        feed = feedparser.parse(url)
        print(f"found {len(feed.entries)} articles.\n")

        for entry in feed.entries:

            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

            if article_date == today or article_date == yesterday:
                link = entry.link

                title = entry.title
                ## clean_title = re.sub('<[^<]+?>', '', title).strip()
                clean_title = html.unescape(title)
                keywords = ["raised", "raises", "secures", "lands", "series"]
                if any(word in clean_title.lower() for word in keywords):
                    print(f"title: {clean_title}")
                    print(f"link: {link}")
                    print("-"*50)

if __name__=="__main__":
    scrape_tc_startups()