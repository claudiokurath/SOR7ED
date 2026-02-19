const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function populateExcerpt() {
  console.log('Populating Excerpts...');
  const blogRes = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
  });
  const posts = (await blogRes.json()).results || [];
  
  for (const post of posts) {
      const title = post.properties.Title?.title?.[0]?.plain_text;
      const content = post.properties.Content?.rich_text?.[0]?.plain_text;
      const excerpt = post.properties.Excerpt?.rich_text?.[0]?.plain_text;

      if (content && !excerpt) {
          // Extract first ~150 chars as Excerpt
          const newExcerpt = content.substring(0, 150) + '...';
          console.log(`Updating Excerpt for: ${title}`);
          try {
            await fetch(`https://api.notion.com/v1/pages/${post.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ properties: { 'Excerpt': { rich_text: [{ text: { content: newExcerpt } }] } } })
            });
          } catch (e) { console.log(e.message); }
      }
  }
  console.log('Done!');
}
populateExcerpt();

