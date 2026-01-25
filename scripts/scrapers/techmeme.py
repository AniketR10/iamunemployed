import feedparser
import re
import html
import sys
from datetime import date, timedelta
import file_saver

def scrape_techmeme():
    url = "https://www.techmeme.com/feed.xml"
    
    print(f"fetching articles from: {url}\n")
    
    save_articles = []
    seen_links = set()

    keywords = ["raised", "raises", "secures", "series", "secured"]
    
    today = date.today()
    prev_days = 1
    start_date = today - timedelta(days=prev_days)

    feed = feedparser.parse(url)
    print(f"found {len(feed.entries)} articles\n")

    for entry in feed.entries:
          
                p = entry.published_parsed
                article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

                if article_date == start_date or article_date == today:
                
                    real_link = entry.link 
                    description = getattr(entry, 'description', '')
                
                    match = re.search(r'href="([^"]*)"', description, re.IGNORECASE)
                    if match:
                        real_link = match.group(1)

                    if real_link in seen_links:
                        continue

                    title = entry.title
                    clean_title = html.unescape(title).strip()
                
                    if any(word in clean_title.lower() for word in keywords):
                        save_articles.append({
                            'title': clean_title,
                            'link': real_link,
                            'date': str(article_date)
                        })
                        seen_links.add(real_link)
                        
                        print(f"Matched: {clean_title}\n")

    if save_articles:
        file_saver.save_common_data("Techmeme", save_articles)
    else:
        print("No matching articles found to save.")


if __name__ == "__main__":
    scrape_techmeme()