import os
import json
import urllib.request
import re
import time

NOTION_TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
NOTION_DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')
GEMINI_KEY = os.environ.get('GEMINI_API_KEY')

def call_gemini(prompt, retries=10):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    for attempt in range(retries):
        req = urllib.request.Request(url, method='POST')
        req.add_header('Content-Type', 'application/json')
        try:
            with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
                res = json.loads(f.read().decode())
                return res['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            if hasattr(e, 'code') and e.code == 429:
                wait_time = (2 ** attempt) + 2
                print(f"   ⚠️ Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            print(f"   ❌ Gemini Error: {e}")
            time.sleep(2)
    return None

def chunk_text(text, limit=1900):
    return [text[i:i+limit] for i in range(0, len(text), limit)]

def update_notion_page(page_id, content):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    chunks = chunk_text(content)
    rich_text = [{"text": {"content": chunk}} for chunk in chunks]
    
    data = {
        "properties": {
            "Template ": {"rich_text": rich_text}
        }
    }
    req = urllib.request.Request(url, method='PATCH')
    req.add_header("Authorization", f"Bearer {NOTION_TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    try:
        urllib.request.urlopen(req, data=json.dumps(data).encode())
        return True
    except Exception as e:
        print(f"   ❌ Notion Update Error: {e}")
        return False

def get_all_pages():
    url = f"https://api.notion.com/v1/databases/{NOTION_DB_ID}/query"
    req = urllib.request.Request(url, method='POST', headers={
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    })
    
    pages = []
    has_more = True
    next_cursor = None
    
    while has_more:
        query_data = {}
        if next_cursor: query_data['start_cursor'] = next_cursor
        
        try:
            with urllib.request.urlopen(req, data=json.dumps(query_data).encode()) as f:
                res = json.loads(f.read().decode())
                pages.extend(res['results'])
                has_more = res['has_more']
                next_cursor = res['next_cursor']
        except Exception as e:
            print(f"❌ Error fetching pages: {e}")
            break
            
    return pages

def process_whatsapp_templates():
    print("🚀 Initializing WhatsApp Template Engine...")
    pages = get_all_pages()
    print(f"📂 Found {len(pages)} protocols to rebuild.")
    
    for i, page in enumerate(pages):
        page_id = page.get('id')
        props = page.get('properties', {})
        
        title = "Untitled"
        if props.get('Title') and props['Title'].get('title'):
            title = props['Title']['title'][0]['plain_text']
        elif props.get('Name') and props['Name'].get('title'):
            title = props['Name']['title'][0]['plain_text']
            
        branch = "Mind"
        if props.get('Branch') and props['Branch'].get('select'):
            branch = props['Branch']['select']['name']

        # Get existing content to work from if available
        source_text = ""
        if props.get('Template ') and props['Template '].get('rich_text') and len(props['Template ']['rich_text']) > 0:
            source_text = props['Template ']['rich_text'][0]['plain_text']
        elif props.get('Content') and props['Content'].get('rich_text') and len(props['Content']['rich_text']) > 0:
            source_text = props['Content']['rich_text'][0]['plain_text']

        print(f"[{i+1}/{len(pages)}] Rebuilding: {title}...")
        
        # Proper URL encoding for the title to match the /blog/[slug] route
        encoded_title = urllib.parse.quote(title)
        vault_link = f"https://sor7ed.com/blog/{encoded_title}"

        prompt = f"""You are a senior neuro-architect at SOR7ED. 
Create a premium WhatsApp-friendly protocol for the topic: "{title}".
Branch: {branch}
Source Material (if any): {source_text[:2000]}

Follow the "SOR7ED Stealth Luxury" WhatsApp format:
- Use emojis sparingly but effectively to guide the eye.
- Keep bullets short and high-impact.
- Focus on the "Smallest Next Step" for executive dysfunction.

Format:
Hey! Ready to resolve this.

📌 **The Hidden Friction:** [1 sentence on why this is hard for ND brains]
⚡ **The Neuro-Shift:** [1 sentence reframe]

🛠️ **THE PROTOCOL:**
1. [Action 1 - Smallest step]
2. [Action 2 - Follow up]
3. [Action 3 - Clean up/Finish]

Read Full Analysis: {vault_link}

Keep it concise for a mobile screen. NO FLUFF. NO INTRO PARAGRAPHS beyond the "Hey!"."""

        content = call_gemini(prompt)
        if content:
            # Clean gemini response
            content = re.sub(r'^```markdown\n', '', content)
            content = re.sub(r'^```\n', '', content)
            content = re.sub(r'\n```$', '', content)
            
            if update_notion_page(page_id, content):
                print(f"   ✅ Template Replaced.")
            else:
                print(f"   ❌ Update Failed.")
        else:
            print(f"   ❌ Generation Failed.")
            
        time.sleep(1.5)

if __name__ == "__main__":
    process_whatsapp_templates()
