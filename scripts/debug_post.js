
const DB_ID = '30a0d6014acc81ebbf18ea14125173e3';
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g';

async function fetchPostContent(titlePart) {
    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
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
                    contains: titlePart
                }
            }
        })
    });
    const data = await response.json();
    if (data.results.length > 0) {
        const page = data.results[0];
        const content = page.properties.Content?.rich_text.map(t => t.plain_text).join('');
        console.log(`--- Content for "${titlePart}" ---`);
        console.log(content.slice(0, 500)); // First 500 chars
        console.log('--- End Content ---');
    } else {
        console.log('Post not found');
    }
}

fetchPostContent('Chronic Pain Crossover');
