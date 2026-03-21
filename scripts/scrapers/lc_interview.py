import requests
import json
import sys
import os
import time
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def ai_filter(title,summary):
    """Passes the title and summary to Groq solely to validate if it's a real experience."""
    prompt = f"""
        You are a data validation assistant analyzing LeetCode posts.
        TITLE: "{title}"
        SUMMARY: "{summary or 'No summary provided.'}"

        ### YOUR TASK:
        Determine if this post is a GENUINE interview experience (sharing questions, timelines, offers, or rejections). 
        If the user is just asking a question (e.g., "Has anyone heard back?", "How to prepare?", "What is the OA like?", "Need advice"), set "is_valid_experience" to false. Otherwise, set it to true.

        Return strictly in JSON format:
        {{
            "is_valid_experience": boolean
        }}
    """
    try:
        chat_completion = groq_client.chat.completions.create(
            model=os.environ.get("LLM_MODEL", "moonshotai/kimi-k2-instruct-0905"),
            messages=[{"role": "system", "content": prompt}],
            stream=False,
            response_format={"type": "json_object"}
        )

        raw_data = chat_completion.choices[0].message.content
        return json.loads(raw_data)
        
    except Exception as e:
        print(f"Groq API error for '{title}': {e}", file=sys.stderr)
        return None

def fetch_and_print_leetcode_posts(fetch_limit):
    url = "https://leetcode.com/graphql"

    include_words = ["interview", "interview experience", "experience", "swe", "sde"]

    exclude_words = ["help","has","anyone","guidance","needed", "guide", "shortlisted", "upcoming","scheduled","expectation","expect", "chances", "looking", "advice", "need"]

    query = """
    query discussPostItems($orderBy: ArticleOrderByEnum, $keywords: [String]!, $tagSlugs: [String!], $skip: Int, $first: Int) {
      ugcArticleDiscussionArticles(
        orderBy: $orderBy
        keywords: $keywords
        tagSlugs: $tagSlugs
        skip: $skip
        first: $first
      ) {
        totalNum
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            title
            slug
            summary
            createdAt
            topicId
          }
        }
      }
    }
    """

    variables = {
        "orderBy": "MOST_RECENT",           
        "keywords": "",                 
        "tagSlugs": ["interview"], 
        "skip": 0,
        "first": fetch_limit
    }

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
    }

    print(f"fetching {fetch_limit} posts to find perfect matches...\n")
    
    try:
        response = requests.post(url, headers=headers, json={"query": query, "variables": variables})
        
        if response.status_code != 200:
            print(f"error: {response.status_code}")
            print(response.text)
            return

        data = response.json()
        
        if "errors" in data:
            print(json.dumps(data["errors"], indent=2))
            return
        
        edges = data.get("data", {}).get("ugcArticleDiscussionArticles", {}).get("edges", [])
        
        if not edges:
            print("no posts found")
            return

        print("-" * 50)

        matched_count =0
        matched_posts=[]

        for edge in edges:
                
            node = edge.get("node", {})
            title = node.get("title", "")
            title_lower = title.lower()
            summary = node.get("summary", "")
            
            if any(bad_word in title_lower for bad_word in exclude_words):
                continue
                
            if include_words and not any(good_word in title_lower for good_word in include_words):
                    continue
            
            print(f"analyzing with AI: {title}", file=sys.stderr)

            ai_data = ai_filter(title, summary)

            if not ai_data:
                continue

            if ai_data.get("is_valid_experience") is False:
                print(" -> AI flagged as invalid/not interview experience post. Skipping.", file=sys.stderr)
                time.sleep(1)
                continue

            print(" -> ✅ valid experience!", file=sys.stderr)

            matched_posts.append({
                "title": title,
                "url": f"https://leetcode.com/discuss/post/{node.get('topicId')}/{node.get('slug')}/",
                "post_date": node.get("createdAt"),
                "summary": summary
            })

            time.sleep(1)
            
        print(f"found {len(matched_posts)} matches!", file=sys.stderr)

        final_json = json.dumps(matched_posts)
        print(f"__DATA_START__{final_json}__DATA_END__")

    except Exception as e:
        print(f"error: {e}", file=sys.stderr)

if __name__ == "__main__":
    fetch_and_print_leetcode_posts(fetch_limit=20)