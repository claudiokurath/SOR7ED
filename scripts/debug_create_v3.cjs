const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function debugCreate() {
  console.log('🔍 Debugging Database & Creation...');

  // 1. Check Schema
  console.log('--- Fetching Database Schema ---');
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28' }
  });
  
  if (!dbRes.ok) {
      console.log('❌ Failed to fetch DB:', await dbRes.text());
      return;
  }
  
  const db = await dbRes.json();
  const props = db.properties;
  console.log('DB Properties:', Object.keys(props).join(', '));
  console.log('Status Type:', props.Status?.type);
  if (props.Status?.type === 'select') {
      console.log('Status Options:', JSON.stringify(props.Status.select.options));
  }

  // 2. Try Creation
  console.log('\n--- Attempting Create ---');
  const payload = {
      parent: { database_id: BLOG_ID },
      properties: {
          'Title': { title: [{ text: { content: 'DEBUG POST' } }] },
          // Try minimal properties first
      }
  };

  // Add Status if exists
  if (props.Status) {
      // Use 'Draft' if available, or 'Published'
      payload.properties['Status'] = { select: { name: 'Published' } }; 
  }

  const createRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  });

  if (createRes.ok) {
      console.log('✅ Creation Success!');
      const page = await createRes.json();
      console.log('Page ID:', page.id);
  } else {
      console.log('❌ Creation FAILED:', createRes.status);
      console.log('Error Body:', await createRes.text());
  }
}

debugCreate();

