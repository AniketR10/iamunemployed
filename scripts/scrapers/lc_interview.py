import requests
import json
import sys

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

            matched_posts.append({
                "title": title,
                "url": f"https://leetcode.com/discuss/post/{node.get('topicId')}/{node.get('slug')}/",
                "post_date": node.get("createdAt"),
                "summary": summary
            })
            
        print(f"found {len(matched_posts)} matches!", file=sys.stderr)

        final_json = json.dumps(matched_posts)
        print(f"__DATA_START__{final_json}__DATA_END__")

    except Exception as e:
        print(f"error: {e}", file=sys.stderr)

if __name__ == "__main__":
    fetch_and_print_leetcode_posts(fetch_limit=20)