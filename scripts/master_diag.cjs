const TOOLS_ID = '2fb0d6014acc80699332d6e01539deb2'; const MASTER_KEY = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e'; const BLOG_ID = '30a0d6014acc81ebbf18ea14125173e3'; const INSIGHTS_ID = '30a0d6014acc81809644c6769eebefac';

async function checkDB(name, id, token) {
  console.log(`\n🔍 Checking ${name} (${id})`);
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 1 })
    });
    
    if (response.ok) {
        console.log(`✅ SUCCESS: Access Confirmed for ${name}`);
    } else {
        console.log(`❌ FAILED: ${response.status} ${response.statusText}`);
        // console.log(await response.text());
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
  }
}

async function run() {
    await checkDB('TOOLS', TOOLS_ID, MASTER_KEY);
    await checkDB('BLOG', BLOG_ID, MASTER_KEY);
    await checkDB('INSIGHTS', INSIGHTS_ID, MASTER_KEY);
}
run();

