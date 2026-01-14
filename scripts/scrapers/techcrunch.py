import feedparser
import re
import html
from datetime import date, timedelta
import file_saver

def scrape_tc_startups():
    urls = [
        "https://techcrunch.com/category/startups/feed/",
        "https://techcrunch.com/category/venture/feed/"
    ]

    save_articles = []
    seen_links = set()
    
    today = date.today()
    prev_days = 1
    start_date = today - timedelta(days=prev_days)
    print(f"fetching articles...")

    for url in urls:
        print(f"parsing from feed: {url}")
        feed = feedparser.parse(url)
        print(f"found {len(feed.entries)} articles.\n")

        for entry in feed.entries:

            p = entry.published_parsed
            article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

            if article_date == start_date or article_date == today:
                link = entry.link

                if link in seen_links:
                    continue

                title = entry.title
                ## clean_title = re.sub('<[^<]+?>', '', title).strip()
                clean_title = html.unescape(title)
                keywords = ["raised", "raises", "secures", "lands", "series", "funding", "announces", "secured", 
                            "backs", "announced", "closes", "closed"]
                if any(word in clean_title.lower() for word in keywords):
                    save_articles.append({
                        'title': clean_title,
                        'link': link,
                        'date': str(article_date)
                    })
                    seen_links.add(link)
                    print(f"title: {clean_title}")
                    print(f"link: {link}")
                    print("-"*50)

    if save_articles:
        file_saver.save_common_data("TechCrunch", save_articles)
    else:
        print("No matching articles found to save.")

if __name__=="__main__":
    scrape_tc_startups()