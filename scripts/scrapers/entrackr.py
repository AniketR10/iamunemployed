import requests
from bs4 import BeautifulSoup
from datetime import date, timedelta, datetime
import file_saver 

def scrape_entrackr():
    urls = [
        "https://entrackr.com/news",
        "https://entrackr.com/snippets",
        "https://entrackr.com/exclusive",
    ]

    print("Connecting to Entrackr...")
    
    today = date.today()
    prev_days = 1
    start_date = today - timedelta(days=prev_days)
    
    print(f"Showing news from: {start_date} to {today}\n")

    keywords = ["raises", "raised", "backs", "invests", "raise", "raising", "secured"]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    file_save = []
    seen_links = set()

    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=20)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, "html.parser")
            
            all_wrappers = soup.find_all("div", class_=["gallery_content", "six_tile", "small-post"])

            for wrapper in all_wrappers:
                title_tag = wrapper.find("h2", class_="title_link")
                if not title_tag:
                    title_tag = wrapper.find("div", class_="post-title")

                if title_tag:
                    raw_title = title_tag.get_text(strip=True)
                    clean_title = raw_title.replace("Exclusive:", "").replace("Exclusive", "").strip()
                    
                    if not any(k in clean_title.lower() for k in keywords):
                        continue
                else:
                    continue

                date_tag = wrapper.find("span", class_="publish-date")
                if not date_tag:
                    date_tag = wrapper.find("div", class_="post-date")
                
                article_date_obj = None
                
                if date_tag:
                    if date_tag.contents:
                        raw_date_str = str(date_tag.contents[0]).strip().replace('"', '')
                    else:
                        raw_date_str = date_tag.get_text(strip=True)

                    try:
                        article_date_obj = datetime.strptime(raw_date_str, "%b %d, %Y").date()
                    except ValueError:
                        continue
                else:
                    continue

                if article_date_obj < start_date:
                    continue

                link_tag = title_tag.find_parent("a")
                if not link_tag:
                    link_tag = wrapper.find("a") 
                
                if link_tag and link_tag.get('href'):
                    raw_link = link_tag.get('href')
                    if raw_link.startswith("/"):
                        final_link = f"https://entrackr.com{raw_link}"
                    else:
                        final_link = raw_link

                    if final_link in seen_links:
                        continue
                    seen_links.add(final_link)
                else:
                    continue

                print(f"[{article_date_obj}] {clean_title}")
                print(f"Link: {final_link}")
                print("-" * 50)

                file_save.append({
                    'title': clean_title,
                    'link': final_link,
                    'date': str(article_date_obj)
                })

        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue

    if file_save:
        file_saver.save_common_data("Entrackr", file_save)
    else:
        print("No recent articles found.")

if __name__ == "__main__":
    scrape_entrackr()