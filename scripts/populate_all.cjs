const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function populateEverything() {
  console.log('🚀 POPULATING EVERY SINGLE EMPTY FIELD...');

  // --- 1. Populate TOOLS Description ---
  const toolsRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
  });
  const tools = (await toolsRes.json()).results || [];
  console.log(`Found ${tools.length} Tools.`);

  for (const tool of tools) {
      const name = tool.properties.Name?.title?.[0]?.plain_text || 'Tool';
      const desc = tool.properties.Description?.rich_text?.[0]?.plain_text;
      
      if (!desc) {
          const newDesc = `Master your workflow with ${name}. Designed for neurodivergent minds to enhance focus and reduce overwhelm.`;
          console.log(`Filling Tool: ${name}`);
          try {
            await fetch(`https://api.notion.com/v1/pages/${tool.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ properties: { 'Description': { rich_text: [{ text: { content: newDesc } }] } } })
            });
          } catch (e) { console.log(e.message); }
      }
  }

  // --- 2. Populate BLOG Content ---
  const blogRes = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
  });
  const posts = (await blogRes.json()).results || [];
  console.log(`Found ${posts.length} Blog Posts.`);

  for (const post of posts) {
      const title = post.properties.Title?.title?.[0]?.plain_text || 'Post';
      const contentProp = post.properties.Content?.rich_text;
      const hasContent = contentProp && contentProp.length > 0;
      
      if (!hasContent) {
          const intro = `\n# ${title}\n\nThis comprehensive guide explores ${title} through a neurodivergent lens. We break down the challenges, the science, and practical strategies that actually work for ADHD and Autistic brains.\n\n## Why This Matters\nStandard advice often fails us because it ignores our unique nervous system needs. In this deep dive, you'll discover:\n- The hidden mechanisms behind ${title}\n- Why just trying harder hasn't worked\n- A subtle shift in perspective that changes everything\n\n## The Protocol\nTo master this area, we recommend following the core principles of our framework...\n\n(Full guide continues...)`;
          
          console.log(`Filling Blog Content: ${title}`);
          try {
            await fetch(`https://api.notion.com/v1/pages/${post.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ properties: { 'Content': { rich_text: [{ text: { content: intro } }] } } })
            });
          } catch (e) { console.log(e.message); }
      }
  }
  console.log('✅ ALL FIELDS POPULATED!');
}

populateEverything();

