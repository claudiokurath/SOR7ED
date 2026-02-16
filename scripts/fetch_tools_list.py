import json
import urllib.request
import os

TOKEN = 'ntn_w359040890853YphUqDZdno5WoORzqo8GemfqYU3kf1aec'
DB_ID = '2fb0d6014acc80699332d6e01539deb2'

def get_tools():
    url = f'https://api.notion.com/v1/databases/{DB_ID}/query'
    req = urllib.request.Request(url, method='POST', headers={
        'Authorization': f'Bearer {TOKEN}',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    })
    
    data = {'page_size': 100}
    try:
        with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
            res = json.loads(f.read().decode())
            results = []
            for p in res['results']:
                props = p['properties']
                name_list = props.get('Name', {}).get('title', [])
                name = name_list[0].get('plain_text', 'Unnamed') if name_list else 'Unnamed'
                
                desc_list = props.get('Description', {}).get('rich_text', [])
                desc = desc_list[0].get('plain_text', '') if desc_list else ''
                
                status = props.get('Status', {}).get('status', {}).get('name', 'No Status')
                results.append({'name': name, 'desc': desc, 'status': status})
            return results
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    tools = get_tools()
    print(json.dumps(tools, indent=2))
