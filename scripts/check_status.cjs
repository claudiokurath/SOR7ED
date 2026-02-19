const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function checkStatus() {
  const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100 })
  });
  const data = await response.json();
  const posts = data.results || [];
  
  let published = 0;
  let draft = 0;
  let other = 0;

  for (const post of posts) {
      const status = post.properties.Status?.status?.name || 'Empty';
      if (status === 'Published') published++;
      else if (status === 'Draft') draft++;
      else other++;
  }
  
  console.log(`Total Posts: ${posts.length}`);
  console.log(`Published: ${published}`);
  console.log(`Draft: ${draft}`);
  console.log(`Other/Empty: ${other}`);
}
checkStatus();

