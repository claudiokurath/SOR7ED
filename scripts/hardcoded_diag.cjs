const TOOLS_ID = '2fb0d6014acc80699332d6e01539deb2'; const TOOLS_KEY = 'ntn_w359040890853YphUqDZdno5WoORzqo8GemfqYU3kf1aec'; const BLOG_ID = '30a0d6014acc81ebbf18ea14125173e3'; const BLOG_KEY = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'; const INSIGHTS_ID = '30a0d6014acc81809644c6769eebefac'; const INSIGHTS_KEY = 'ntn_m35904089086ppdrvL5RvYTm4gSHMn8Iibaj44dCC2daef';





// Also check INSIGHTS if they are different

async function checkDB(name, id, token) {
    console.log(`\n🔍 Checking Database: ${name} (${id})`);
    if (!id || !token) {
        console.error(`❌ Missing ID or Token for ${name}`);
        return;
    }

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

        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ Query Failed for ${name}: ${response.status} ${response.statusText}`);
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log(`✅ Access Confirmed for ${name}.`);

        if (data.results.length > 0) {
            const page = data.results[0];
            console.log(`   Sample Page ID: ${page.id}`);
            console.log(`   Properties Found: ${Object.keys(page.properties).join(', ')}`);

            // Print property types for debugging
            const propTypes = {};
            for (const [key, val] of Object.entries(page.properties)) {
                propTypes[key] = val.type;
            }
            console.log(`   Property Types: ${JSON.stringify(propTypes, null, 2)}`);
        } else {
            console.log(`⚠️ Database is accessible but EMPTY.`);
        }

    } catch (error) {
        console.error(`❌ Network Error for ${name}:`, error.message);
    }
}

async function run() {
    await checkDB('TOOLS', TOOLS_ID, TOOLS_KEY);
    await checkDB('BLOG', BLOG_ID, BLOG_KEY);
    if (INSIGHTS_ID !== BLOG_ID) {
        await checkDB('INSIGHTS', INSIGHTS_ID, INSIGHTS_KEY);
    }
}

run();
