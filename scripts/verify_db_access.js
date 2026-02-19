
const DB_ID = '30a0d6014acc81ebbf18ea14125173e3';
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g';

async function verifyAccess() {
  console.log('🔍 Checking Access to Database:', DB_ID);

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 5 })
    });

    if (!response.ok) {
      console.error(`❌ Access Failed. Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      return;
    }

    const data = await response.json();
    console.log(`✅ Access Confirmed.`);
    console.log(`Total Pages Found (in query limit): ${data.results.length}`);
    console.log('--- Latest 5 Posts found ---');
    data.results.forEach(p => {
      const title = p.properties.Title?.title?.[0]?.plain_text || 'Untitled';
      const status = p.properties.Status?.status?.name || 'No Status';
      console.log(`- ${title} [${status}]`);
    });

  } catch (error) {
    console.error('Network Error:', error);
  }
}

verifyAccess();
