const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function archiveRemaining() {
  let hasMore = true;
  while(hasMore) {
    const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    const posts = data.results || [];
    if (posts.length === 0) {
        hasMore = false;
        console.log('Database is empty.');
        break;
    }
    console.log(`Archiving ${posts.length} remaining items...`);
    for (const p of posts) {
        await fetch(`https://api.notion.com/v1/pages/${p.id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify({ archived: true })
        });
    }
  }
}
archiveRemaining();

