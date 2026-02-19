const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function verifyStatus() {
  console.log('Verifying Status...');
  
  // Blog
  const blogRes = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1 }) // first one should be Published
  });
  const data = await blogRes.json();
  const p = data.results[0];
  console.log(`Blog Post: ${p.properties.Title?.title?.[0]?.plain_text}`);
  console.log(`Status: ${p.properties.Status?.status?.name}`);
  console.log(`Content Length: ${p.properties.Content?.rich_text?.length}`);
  const cta = p.properties['CTA']?.rich_text;
  console.log(`CTA: ${cta ? cta.map(c => c.plain_text).join('') : 'Empty'}`);
  
  // Tools
  const toolsRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1 })
  });
  const t = (await toolsRes.json()).results[0];
  console.log(`Tool: ${t.properties.Name?.title?.[0]?.plain_text}`);
  console.log(`Status: ${t.properties.Status?.status?.name}`);
  console.log(`Description: ${t.properties.Description?.rich_text?.[0]?.plain_text || 'Empty'}`);
}
verifyStatus();

