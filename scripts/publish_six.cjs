const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function publishSix() {
  console.log('🚀 Publishing 6 Tools & 6 Blog Posts...');

  // --- 1. TOOLS ---
  const toolsRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 6 }) 
  });
  const tools = (await toolsRes.json()).results || [];
  console.log(`Found ${tools.length} Tools to publish.`);

  for (const tool of tools) {
      const name = tool.properties.Name?.title?.[0]?.plain_text;
      console.log(`Publishing Tool: ${name}`);
      try {
        await fetch(`https://api.notion.com/v1/pages/${tool.id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: { 'Status': { status: { name: 'Published' } } } }) // Assuming standard Status property
        });
      } catch (e) { console.log(e.message); }
  }

  // --- 2. BLOG ---
  const blogRes = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 6 })
  });
  const posts = (await blogRes.json()).results || [];
  console.log(`Found ${posts.length} Blog Posts to publish.`);

  for (const post of posts) {
      const title = post.properties.Title?.title?.[0]?.plain_text;
      console.log(`Publishing Post: ${title}`);
      try {
        await fetch(`https://api.notion.com/v1/pages/${post.id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: { 'Status': { status: { name: 'Published' } } } })
        });
      } catch (e) { console.log(e.message); }
  }
  console.log('✅ Done!');
}

publishSix();

