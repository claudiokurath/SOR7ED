const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const OLD_BLOG_ID = '2d80d6014acc8057bbb9e15e74bf70c6';
const NEW_BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function cloneSmart() {
  console.log('🚀 Smart Cloning: Detecting Status Options First...');

  // 1. Get New Schema
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${NEW_BLOG_ID}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28' }
  });
  if (!dbRes.ok) {
      console.log('❌ Failed to fetch New DB:', await dbRes.text());
      return;
  }
  const db = await dbRes.json();
  
  // 2. Determine Correct Status Payload
  let statusPayload = null;
  const statusProp = db.properties.Status;
  
  if (statusProp.type === 'status') {
      const options = statusProp.status.options;
      const groups = statusProp.status.groups; // Check this too
      console.log('Valid Status Options:', options.map(o => o.name).join(', '));
      
      // Try 'Published' or 'Live' or 'Done'
      const target = ['Published', 'Live', 'Done', 'Complete'].find(t => options.some(o => o.name.toLowerCase() === t.toLowerCase()));
      
      if (target) {
          console.log(`✅ Using Status: ${target}`);
          statusPayload = { status: { name: target } };
      } else {
          console.log('⚠️ No obvious Published status found. Using first available.');
          statusPayload = { status: { name: options[0].name } };
      }
  } else if (statusProp.type === 'select') {
      console.log('Status is SELECT type.');
      statusPayload = { select: { name: 'Published' } };
  } else {
      console.log('⚠️ Status property incorrect type:', statusProp.type);
  }

  if (!statusPayload) return;

  // 3. Clone
  const oldRes = await fetch(`https://api.notion.com/v1/databases/${OLD_BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
  });
  const oldPosts = (await oldRes.json()).results || [];
  console.log(`Cloning ${oldPosts.length} posts...`);

  let count = 0;
  for (const oldPost of oldPosts) {
      const title = oldPost.properties.Title?.title?.[0]?.plain_text || 'Untitled';
      const content = oldPost.properties.Content?.rich_text || oldPost.properties['Post Body']?.rich_text || [];
      const contentText = content.map(c => c.plain_text).join(''); 
      const excerpt = contentText.substring(0, 150) + '...';
      
      // Branch logic
      let branch = 'Life';
      const tLower = title.toLowerCase();
      if (tLower.includes('adhd') || tLower.includes('mind') || tLower.includes('focus')) branch = 'Mind';
      else if (tLower.includes('body') || tLower.includes('sensory')) branch = 'Body';
      else if (tLower.includes('money') || tLower.includes('wealth') || tLower.includes('tax')) branch = 'Wealth';
      else if (tLower.includes('friend') || tLower.includes('relationship') || tLower.includes('intimacy')) branch = 'Connection';
      else if (tLower.includes('tech') || tLower.includes('app') || tLower.includes('digital')) branch = 'Tech';
      else if (tLower.includes('masking') || tLower.includes('impression')) branch = 'Impression';

      const keyword = branch.toUpperCase();
      const ctaText = `Struggling with ${title.substring(0, 15)}...? Text `;
      
      const payload = {
            parent: { database_id: NEW_BLOG_ID },
            properties: {
                'Title': { title: [{ text: { content: title } }] },
                'Status': statusPayload,
                'Branch': { select: { name: branch } },
                'Content': content.length > 0 ? { rich_text: content.slice(0, 50) } : undefined, // Limit blocks to avoid 400? Using slice 50 blocks.
                'Meta Description': { rich_text: [{ text: { content: excerpt } }] },
                'Publish Date': { date: { start: new Date().toISOString() } },
                'CTA': { 
                    rich_text: [
                        { text: { content: ctaText } },
                        { text: { content: keyword, link: { url: `https://wa.me/447360277713?text=${keyword}` } }, annotations: { bold: true } },
                        { text: { content: ' to get the guide.' } }
                    ]
                }
      };

      try {
        const createRes = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!createRes.ok) {
            console.log(`❌ Failed to clone ${title}: `, await createRes.text());
        } else {
            process.stdout.write('.');
            count++;
        }
      } catch (e) { }
  }
  console.log(`\n✅ Success: ${count} / ${oldPosts.length}`);
}

cloneSmart();

