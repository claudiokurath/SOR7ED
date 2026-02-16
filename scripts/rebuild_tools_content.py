import os
import json
import urllib.request
import re
import time

NOTION_TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
NOTION_DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')
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

def update_notion_page(page_id, updates):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    data = { "properties": updates }
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

def process_tools():
    print("🚀 Initializing Tool Architecture Engine...")
    pages = get_all_pages()
    print(f"📂 Found {len(pages)} tool definitions.")
    
    for i, page in enumerate(pages):
        page_id = page.get('id')
        props = page.get('properties', {})
        
        name = "Untitled Tool"
        if props.get('Name') and props['Name'].get('title'):
            name = props['Name']['title'][0]['plain_text']
        
        desc = ""
        if props.get('Description') and props['Description'].get('rich_text'):
            desc = "".join([t['plain_text'] for t in props['Description']['rich_text']])

        # Skip if already has template (unless forced)
        if props.get('Template') and props['Template'].get('rich_text') and len(props['Template']['rich_text']) > 0:
            print(f"[{i+1}/{len(pages)}] Skipping: {name} (Already has template)")
            continue

        print(f"[{i+1}/{len(pages)}] Architecting: {name}...")
        
        prompt = f"""You are a senior neuro-divergent systems engineer at SOR7ED.
You need to design an interactive "online tool" for: "{name}"
Description: {desc}

Every tool must have:
1. A JSON-based schema for interactive elements.
2. A premium, high-fidelity description.
3. A "How It Works" protocol.

### PART 1: INTERACTIVE SCHEMA (JSON)
Define the UI components needed. Supported components: "input" (number/text), "slider" (range), "toggle", "display" (result).
Example format:
{{"fields": [{{"id": "hours", "label": "Target Hours", "type": "number", "default": 1}}], "logic": "hours * 1.5", "unit": "Estimated Reality Time"}}

### PART 2: THE GUIDE (Markdown)
Write a premium, architectural guide that users can read or download. Use professional but empathetic tone.

### RESPONSE FORMAT:
---SCHEMA---
[JSON Schema Here]
---GUIDE---
[Markdown Guide Here]
---

Keep it concise and modular."""

        response = call_gemini(prompt)
        if response:
            try:
                # Clean and parse response
                if "---SCHEMA---" in response and "---GUIDE---" in response:
                    schema_data = response.split("---SCHEMA---")[1].split("---GUIDE---")[0].strip()
                    guide_data = response.split("---GUIDE---")[1].split("---")[0].strip()
                else:
                    schema_data = "{}"
                    guide_data = response

                # Validate JSON schema
                try:
                    json.loads(schema_data)
                except:
                    schema_data = "{}"

                updates = {
                    "Template": {"rich_text": [{"text": {"content": schema_data}}]},
                    "Description": {"rich_text": [{"text": {"content": guide_data[:2000]}}]},
                    "Slug": {"rich_text": [{"text": {"content": name.lower().replace(' ', '-').replace("'", "")}}]}
                }
                
                # Check if Status 'Public' exists before setting
                if update_notion_page(page_id, updates):
                    print(f"   ✅ Tool Updated.")
                else:
                    print(f"   ❌ Update Failed.")
            except Exception as e:
                print(f"   ❌ Processing Error: {e}")
        else:
            print(f"   ❌ Generation Failed.")
            
        time.sleep(2)

if __name__ == "__main__":
    process_tools()
