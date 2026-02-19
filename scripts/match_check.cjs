const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const OLD_BLOG_ID = '2d80d6014acc8057bbb9e15e74bf70c6';
const NEW_BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function verifyContentMatch() {
  console.log('Comparing Content (Old -> New)...');
  
  const [oldRes, newRes] = await Promise.all([
    fetch(`https://api.notion.com/v1/databases/${OLD_BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
    }),
    fetch(`https://api.notion.com/v1/databases/${NEW_BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
    })
  ]);

  const oldPosts = (await oldRes.json()).results || [];
  const newPosts = (await newRes.json()).results || [];

  console.log(`Old DB: ${oldPosts.length} posts.`);
  console.log(`New DB: ${newPosts.length} posts.`);

  // Helper to normalize
  const normalize = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  // Check how many New Posts have matching Old Posts
  let matches = 0;
  for (const n of newPosts) {
      const nTitle = n.properties.Title?.title?.[0]?.plain_text;
      const match = oldPosts.find(o => normalize(o.properties.Title?.title?.[0]?.plain_text) === normalize(nTitle));
      if (match) {
          console.log(`✅ NEW Match: ${nTitle} (Found in OLD)`);
          matches++;
      } else {
          // console.log(`❌ NEW No Match: ${nTitle}`);
      }
  }
  console.log(`Total Matches: ${matches} out of ${newPosts.length}`);
}
verifyContentMatch();

