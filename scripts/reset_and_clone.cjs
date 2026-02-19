const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const OLD_BLOG_ID = '2d80d6014acc8057bbb9e15e74bf70c6';
const NEW_BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function resetAndClone() {
    console.log('🚀 STARTING FRESH: Wipe & Clone...');

    const headers = {
        'Authorization': 'Bearer ' + TOKEN,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    };

    // --- STEP 1: INSPECT NEW DB SCHEMA ---
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${NEW_BLOG_ID}`, { method: 'GET', headers });
    if (!dbRes.ok) { console.log('❌ Failed to fetch New DB:', await dbRes.text()); return; }
    const db = await dbRes.json();

    // Determine correct Status payload
    let statusPayload = null;
    const sProp = db.properties.Status;
    if (sProp && sProp.type === 'status') {
        const opts = sProp.status.options;
        const target = ['Published', 'Live', 'Done', 'Complete'].find(t => opts.some(o => o.name.toLowerCase() === t.toLowerCase())) || opts[opts.length - 1].name;
        console.log(`✅ Target Status (Status Type): "${target}"`);
        statusPayload = { status: { name: target } };
    } else if (sProp && sProp.type === 'select') {
        console.log(`✅ Target Status (Select Type): "Published"`);
        statusPayload = { select: { name: 'Published' } };
    } else {
        console.log('⚠️ Status property missing or unknown type. Skipping status.');
    }

    // --- STEP 2: WIPE NEW DB (Archive All) ---
    console.log('🧹 Wiping New Database...');
    let hasMore = true;
    while (hasMore) {
        const q = await fetch(`https://api.notion.com/v1/databases/${NEW_BLOG_ID}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 100 }) });
        const res = await q.json();
        const toDelete = res.results || [];
        if (toDelete.length === 0) { hasMore = false; break; }

        console.log(`Archiving batch of ${toDelete.length}...`);
        await Promise.all(toDelete.map(p => fetch(`https://api.notion.com/v1/pages/${p.id}`, {
            method: 'PATCH', headers, body: JSON.stringify({ archived: true })
        })));
    }
    console.log('✅ Database Wiped.');

    // --- STEP 3: FETCH OLD CONTENT ---
    console.log('📥 Fetching Old Content...');
    const oldQ = await fetch(`https://api.notion.com/v1/databases/${OLD_BLOG_ID}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 100 }) }); // Assuming <100 for now or fetch all?
    const oldPosts = (await oldQ.json()).results || [];
    console.log(`Found ${oldPosts.length} posts to clone.`);

    // --- STEP 4: CLONE ---
    console.log('✨ Cloning...');
    let success = 0;

    for (const p of oldPosts) {
        const title = p.properties.Title?.title?.[0]?.plain_text || 'Untitled';
        // Content extraction (Generic 'Content' or 'Post Body')
        const content = p.properties.Content?.rich_text || p.properties['Post Body']?.rich_text || [];
        const contentText = content.map(c => c.plain_text).join('');
        const excerpt = contentText.substring(0, 150) + '...';

        // Branch Logic
        let branch = 'Life';
        const tLower = title.toLowerCase();
        if (tLower.includes('adhd') || tLower.includes('mind') || tLower.includes('focus')) branch = 'Mind';
        else if (tLower.includes('body') || tLower.includes('sensory')) branch = 'Body';
        else if (tLower.includes('money') || tLower.includes('wealth') || tLower.includes('tax')) branch = 'Wealth';
        else if (tLower.includes('friend') || tLower.includes('relationship') || tLower.includes('intimacy')) branch = 'Connection';
        else if (tLower.includes('tech') || tLower.includes('app') || tLower.includes('digital')) branch = 'Tech';
        else if (tLower.includes('masking') || tLower.includes('impression')) branch = 'Impression';

        const keyword = branch.toUpperCase();
        const ctaText = `Struggling with ${title.substring(0, 15)}...? Text `;

        const payload = {
            parent: { database_id: NEW_BLOG_ID },
            properties: {
                'Title': { title: [{ text: { content: title } }] },
                'Branch': { select: { name: branch } },
                'Meta Description': { rich_text: [{ text: { content: excerpt } }] },
                'Excerpt': { rich_text: [{ text: { content: excerpt } }] }, // Populate both
                'Publish Date': { date: { start: new Date().toISOString() } },
                'CTA': {
                    rich_text: [
                        { text: { content: ctaText } },
                        { text: { content: keyword, link: { url: `https://wa.me/447360277713?text=${keyword}` } }, annotations: { bold: true } },
                        { text: { content: ' to get the guide.' } }
                    ]
                }
            }
        };

        if (statusPayload) payload.properties['Status'] = statusPayload;

        // Add Content (property)
        if (content.length > 0) {
            // Slice to avoid 2000 limit per element? Notion rich_text array has limit 2000 chars *per text object*. 
            // If original array has managed blocks, we assume fine. 
            // But safer to just limit total length for property injection?
            // We'll trust Notion API mostly, but catch 400.
            payload.properties['Content'] = { rich_text: content.slice(0, 20) }; // Limit number of rich text blocks to 20
        }

        const createRes = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST', headers, body: JSON.stringify(payload)
        });

        if (createRes.ok) {
            success++;
            process.stdout.write('.');
        } else {
            console.log(`\n❌ Error "${title}":`, await createRes.text());
        }
    }
    console.log(`\n✅ DONE: ${success} / ${oldPosts.length} posts cloned.`);
}

resetAndClone();
