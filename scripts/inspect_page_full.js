
const DB_ID = '30a0d6014acc81ebbf18ea14125173e3';
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g';

async function inspectPage() {
    // 1. Find Page ID
    const query = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filter: {
                property: 'Title',
                rich_text: {
                    contains: 'Chronic Pain Crossover'
                }
            }
        })
    }).then(r => r.json());

    if (query.results.length === 0) {
        console.log('Post not found');
        return;
    }

    const page = query.results[0];
    const pageId = page.id;
    console.log(`Analyzing Page: ${pageId}`);

    // 2. Check Content Property
    const propContent = page.properties.Content?.rich_text.map(t => t.plain_text).join('');
    console.log('\n--- Content Property (First 200 chars) ---');
    console.log(propContent.slice(0, 200));

    // 3. Check Page Blocks (Body)
    const blocks = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Notion-Version': '2022-06-28'
        }
    }).then(r => r.json());

    console.log(`\n--- Page Body Blocks (${blocks.results.length}) ---`);
    blocks.results.forEach((b, i) => {
        if (i < 5) console.log(`[${b.type}]`);
    });

    // Check for duplication
    // If Body converts to text similar to Property?
}

inspectPage();
