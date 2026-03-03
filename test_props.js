const NOTION_API_KEY = 'ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ';
const TOOLS_DB_ID = '08ac767d313845ca91886ce45c379b99';

async function test() {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${TOOLS_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.results.length > 0) {
            console.log(JSON.stringify(data.results[0].properties, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
