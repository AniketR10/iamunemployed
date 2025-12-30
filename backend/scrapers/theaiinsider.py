import feedparser
from datetime import date

def scrape_func():
     url = "https://theaiinsider.tech/category/news/feed/"

     keywords = [
        "raised", "funding", "announces", "secured", 
         "backs", "announced", "secures", "raises", "closes", "closed"
    ]

     today = date.today()
     print(f"scraping the rss from {url}")

     feed = feedparser.parse(url, agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

     if not feed.entries:
          print(f"❌ Could not fetch feed (or it's empty).")
          return
     
     cnt =0

     for entry in feed.entries:
          if hasattr(entry, "published_parsed"):
               p = entry.published_parsed
               article_date = date(p.tm_year, p.tm_mon, p.tm_mday)

               if article_date == today:
                    
                    title = entry.title
                    link = entry.link
                    lower_txt = title.lower()

                    if any(k in lower_txt for k in keywords):
                         print(f"title: {title}")
                         print(f"link: {link}")
                         cnt+=1
     if cnt >0:
          print(f"{cnt} articles found for today")
     else:
          print(f"no article found for today")

if __name__ == "__main__":
     scrape_func()
     

