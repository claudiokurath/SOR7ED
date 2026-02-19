const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';

async function listDatabases() {
  console.log('🔍 Searching for accesible databases...');
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        filter: { value: 'database', property: 'object' },
        page_size: 100 
      })
    });
    
    if (!response.ok) {
        console.log(`❌ Search Failed: ${response.status} ${response.statusText}`);
        return;
    }

    const data = await response.json();
    console.log(`✅ Found ${data.results.length} accessible databases:`);
    
    data.results.forEach(db => {
        const title = db.title?.[0]?.plain_text || 'Untitled';
        const id = db.id.replace(/-/g, '');
        console.log(`   - ${title}`);
        console.log(`     ID: ${id}`);
        console.log(`     (Original ID: ${db.id})`);
    });

  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
}

listDatabases();

