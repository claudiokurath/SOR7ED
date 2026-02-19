const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function checkBlogStatus() {
  const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1 })
  });
  const data = await response.json();
  if (data.results?.length > 0) {
      const p = data.results[0];
      const title = p.properties.Title?.title?.[0]?.plain_text;
      const cta = p.properties.CTA?.rich_text;
      
      console.log(`✅ Blog Database has items.`);
      console.log(`Sample Post: ${title}`);
      
      if (cta && cta.length > 0) {
          const text = cta.map(c => c.plain_text).join('');
          console.log(`   - CTA: ${text}`);
          const link = cta.find(c => c.href)?.href;
          console.log(`   - Link: ${link || 'None'}`);
      } else {
          console.log(`   - CTA: EMPTY`);
      }
      
      const content = p.properties.Content?.rich_text;
      console.log(`   - Body Content: ${content?.length > 0 ? 'Present' : 'Empty'}`);
  } else {
      console.log('Blog Database is Empty.');
  }
}
checkBlogStatus();

