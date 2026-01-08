import requests
from bs4 import BeautifulSoup
from datetime import date, timedelta
from dateutil import parser
import time
import file_saver

def scrape_saas_news_pagination():
    base_url = "https://www.thesaasnews.com"
    today = date.today()
    prev_days = 1
    start_date = today - timedelta(days=prev_days)
    file_save = []
    seen_links = set()

    
    print(f" starting Multi-Page Scraper...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    page_num = 1
    keep_scraping = True
    total_found = 0

    while keep_scraping:

        if page_num == 1:
            list_url = f"{base_url}/news"
        else:
            list_url = f"{base_url}/news?page={page_num}"

        print(f" Scanning Page {page_num} ({list_url})...")
        
        try:
            response = requests.get(list_url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            
            snippets = soup.find_all("a", class_="blog-listing-snippet")
            
            if not snippets:
                print(" No articles found on this page...")
                break

            for snippet in snippets:
                relative_link = snippet.get('href')
                full_link = f"{base_url}{relative_link}" if relative_link.startswith("/") else relative_link
                
                if full_link in seen_links:
                    continue

                header_tag = snippet.find("h2")
                title = header_tag.get_text(strip=True) if header_tag else "No Title"
                
                desc_tag = snippet.find("p")
                description = desc_tag.get_text(strip=True) if desc_tag else "No Description"

                try:
                    article_resp = requests.get(full_link, headers=headers, timeout=5)
                    article_soup = BeautifulSoup(article_resp.text, "html.parser")
                    
                    date_tag = article_soup.find("span", class_="blog-authored_on")
                    
                    if date_tag:
                        date_str = date_tag.get_text(strip=True)
                        article_date = parser.parse(date_str).date()
                        
                        if article_date == start_date:
                            print(f"    FOUND: {title}")
                            print(f"      Desc: {description[:80]}...")
                            print(f"      Link: {full_link}")

                            file_save.append({
                                "title": title,
                                "link": full_link,
                                "date": str(start_date)
                            })
                            seen_links.add(full_link)
                            total_found += 1
                        
                        elif article_date < start_date:

                            print(f"\n found older article ({article_date}). Stopping scraper.")
                            keep_scraping = False
                            break
                    
                    time.sleep(0.5)

                except Exception as e:
                    print(f" Error checking link: {e}")

            if keep_scraping:
                page_num += 1
                print(f"  Moving to Page {page_num}...\n")
                time.sleep(1.0)

        except Exception as e:
            print(f" error on Page {page_num}: {e}")
            break

    if file_save:
        print(f" Saving {len(file_save)} articles...")
        file_saver.save_common_data("The SaaS News", file_save)
    else:
        print(" No articles found for the target date.")

if __name__ == "__main__":
    scrape_saas_news_pagination()