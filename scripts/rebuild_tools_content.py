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

def chunk_text(text, limit=1950):
    return [text[i:i+limit] for i in range(0, len(text), limit)]

def to_rich_text(text):
    if not text: return []
    chunks = chunk_text(text)
    return [{"text": {"content": chunk}} for chunk in chunks]

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
        if hasattr(e, 'read'):
            print(f"   ❌ Notion Error: {e.read().decode()}")
        else:
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
    print("🧠 Initializing ULTIMATE Protocol Architect v2.0 for SOR7ED...")
    pages = get_all_pages()
    print(f"📂 Found {len(pages)} protocol definitions. Starting Total Fill...")
    
    for i, page in enumerate(pages):
        page_id = page.get('id')
        props = page.get('properties', {})
        
        name = "Untitled Tool"
        if props.get('Name') and props['Name'].get('title'):
            name = props['Name']['title'][0]['plain_text']
        
        print(f"[{i+1}/{len(pages)}] Total Reconstruction: {name}...")
        
        prompt = f"""You are the lead neuro-architect at SOR7ED.
You are designing the definitive interactive system for: "{name}"

You must fill in EVERY SINGLE property for this tool. 
No placeholders. No generic text. High-fidelity, empathetic, and surgical.

### REQUIRED FIELDS:
---WHATSAPP_CTA---
[Keyword in ALL CAPS, e.g. DOPAMINE]
---PROBLEM_STATEMENT---
[Deep cognitive pain point this solves.]
---WHO_ITS_FOR---
[Personas and situations.]
---HOW_IT_WORKS---
[Sequential physical/digital steps.]
---SCHEMA---
[JSON for UI. Fields: input(number/text), slider(number), toggle(bool). Logic must be a simple math string.]
---META_DESCRIPTION---
[SEO text < 160 chars.]
---WHAT_YOU_GET---
[Outcome bullets.]
---FAQ---
[ND-specific Q&A.]
---OUTPUT_FORMAT---
[Deliverable description.]
---DESCRIPTION---
[A concise (2-sentence) punchy summary of the tool for card views.]
---TARGET_AUDIENCE---
[Brief one-liner.]
---TECH_STACK---
[e.g. React, Notion API, WhatsApp Concierge, Gemini Pro 2.0]
---DATA_CAPTURE---
[e.g. Zero-retention, local processing, WhatsApp response]
---BRANCH---
[Pick one: Mind, Wealth, Body, Tech, Connection, Impression, Growth]
---PRICE---
[Number between 9 and 49 based on tool complexity/value. No currency symbol.]
---

Maintain 'Stealth Luxury' brand voice: concise, powerful, premium."""

        response = call_gemini(prompt)
        if response:
            try:
                def extract(tag):
                    pattern = f'---{tag}---\n(.*?)(?=\n---|$)'
                    match = re.search(pattern, response, re.S)
                    return match.group(1).strip() if match else ""

                # Extract Price
                price_str = extract("PRICE")
                try:
                    price = int(re.search(r'\d+', price_str).group())
                except:
                    price = 19 # Default

                updates = {
                    "WhatsApp CTA": {"rich_text": to_rich_text(extract("WHATSAPP_CTA"))},
                    "Problem Statement": {"rich_text": to_rich_text(extract("PROBLEM_STATEMENT"))},
                    "Who It's For": {"rich_text": to_rich_text(extract("WHO_ITS_FOR"))},
                    "How It Works": {"rich_text": to_rich_text(extract("HOW_IT_WORKS"))},
                    "Template": {"rich_text": to_rich_text(extract("SCHEMA"))},
                    "Meta Description": {"rich_text": to_rich_text(extract("META_DESCRIPTION"))},
                    "What You Get": {"rich_text": to_rich_text(extract("WHAT_YOU_GET"))},
                    "FAQ": {"rich_text": to_rich_text(extract("FAQ"))},
                    "Output Format": {"rich_text": to_rich_text(extract("OUTPUT_FORMAT"))},
                    "Description": {"rich_text": to_rich_text(extract("DESCRIPTION"))},
                    "Target Audience": {"rich_text": to_rich_text(extract("TARGET_AUDIENCE"))},
                    "Tech Stack": {"rich_text": to_rich_text(extract("TECH_STACK"))},
                    "Data Capture": {"rich_text": to_rich_text(extract("DATA_CAPTURE"))},
                    "Credit Cost": {"number": price},
                    "Slug": {"rich_text": to_rich_text(name.lower().replace(' ', '-').replace("'", "").replace("?", "").replace("!", "").replace(",", ""))},
                    "Status": {"status": {"name": "Public"}}
                }
                
                # Handle Branch Select
                branch_name = extract("BRANCH").capitalize()
                valid_branches = ["Mind", "Wealth", "Body", "Tech", "Connection", "Impression", "Growth"]
                if branch_name in valid_branches:
                    updates["Branch"] = {"select": {"name": branch_name}}

                if update_notion_page(page_id, updates):
                    print(f"   ✅ Protocol Fully Initialized.")
                else:
                    print(f"   ❌ Update Failed.")
            except Exception as e:
                print(f"   ❌ Processing Error: {e}")
        else:
            print(f"   ❌ Generation Failed.")
            
        time.sleep(3) # Slower to be safe

if __name__ == "__main__":
    process_tools()
