const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function listBlogItems() {
    const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100 })
    });
    const data = await response.json();
    console.log(`Blog (New) has ${data.results.length} posts.`);
    
    // Sort and display
    const posts = data.results.map(p => ({
        id: p.id,
        title: p.properties.Title?.title?.[0]?.plain_text || 'Untitled',
        status: p.properties.Status?.select?.name || 'Empty',
        slug: p.properties.Slug?.rich_text?.[0]?.plain_text || 'No Slug',
        trigger: p.properties.Trigger?.rich_text?.[0]?.plain_text || 'None'
    }));

    console.log('--- Current Blog Posts ---');
    posts.forEach(p => console.log(`t: ${p.title} | s: ${p.status} | slug: ${p.slug}`));
}
listBlogItems();

