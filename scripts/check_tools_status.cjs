const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function checkTools() {
  const response = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1 })
  });
  const data = await response.json();
  if (data.results?.length > 0) {
      console.log(`Tools Database has ${data.results.length} items (via page limit).`);
      const t = data.results[0];
      const name = t.properties.Name?.title?.[0]?.plain_text;
      const emoji = t.properties.Emoji?.rich_text?.[0]?.plain_text || t.icon?.emoji;
      const kw = t.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text;
      console.log(`Sample Tool: ${name}`);
      console.log(`   - Emoji: ${emoji}`);
      console.log(`   - Keyword: ${kw}`);
  } else {
      console.log('Tools Database is Empty.');
  }
}
checkTools();

