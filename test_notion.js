const fetch = require('node-fetch');
const NOTION_API_KEY = "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ";
const BLOG_DB_ID = "db668e4687ed455498357b8d11d2c714";

async function run() {
    const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sorts: [{ property: 'Publish Date', direction: 'descending' }]
        })
    });
    console.log(response.status);
    const data = await response.text();
    console.log(data);
}
run();
