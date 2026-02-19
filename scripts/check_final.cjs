const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const DBS = [
  { name: 'TOOLS (User Linked 2)', id: '08ac767d313845ca91886ce45c379b99' },
  { name: 'BLOG (User Linked 3)', id: 'db668e4687ed455498357b8d11d2c714' },
  { name: 'BLOG (OLD?) (User Linked 4)', id: '2d80d6014acc8057bbb9e15e74bf70c6' }
];

async function checkSchema(db) {
  console.log(`\n🔍 Checking Schema for ${db.name} (${db.id})`);
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${db.id}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 1 })
    });
    
    if (!response.ok) {
        console.log(`❌ Failed to access.`);
        return;
    }
    const data = await response.json();
    if (data.results.length === 0) {
        console.log();
        return;
    }
    
    const props = data.results[0].properties;
    const propKeys = Object.keys(props);
    console.log(`✅ Properties Found: ${propKeys.join(', ')}`);
    
    if (propKeys.includes('WhatsApp Keyword') && propKeys.includes('Emoji')) console.log('   -> 🛠️ LOOKS LIKE A TOOLS DATABASE');
    else if (propKeys.includes('Read Time') && propKeys.includes('Post Body')) console.log('   -> 📝 LOOKS LIKE A BLOG DATABASE');
    else if (propKeys.includes('Phone Number') && propKeys.includes('Lead Source')) console.log('   -> 👥 LOOKS LIKE A CRM DATABASE');
    else console.log('   -> ❓ UNKNOWN DATABASE TYPE');

  } catch (e) { console.log(e.message); }
}

async function run() {
    for (const db of DBS) { await checkSchema(db); }
}
run();

