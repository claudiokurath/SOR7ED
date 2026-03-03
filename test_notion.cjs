const { Client } = require('@notionhq/client');

const notion = new Client({ auth: 'ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ' });
const databaseId = '08ac767d313845ca91886ce45c379b99';

async function test() {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            page_size: 5
        });
        console.log('Results count:', response.results.length);
        if (response.results.length > 0) {
            console.log('Properties:', JSON.stringify(response.results[0].properties, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
