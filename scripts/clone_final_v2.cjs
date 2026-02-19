const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const OLD_BLOG_ID = '2d80d6014acc8057bbb9e15e74bf70c6';
const NEW_BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function cloneFinal() {
    console.log('🚀 Final Clone Attempt...');

    // 1. Get New Schema to find valid Status option
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${NEW_BLOG_ID}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28' }
    });
    if (!dbRes.ok) {
        console.log('❌ Failed to fetch New DB Schema:', await dbRes.text());
        return;
    }
    const db = await dbRes.json();
    const statusProp = db.properties.Status;

    let statusPayload = null;
    if (statusProp.type === 'status') {
        const options = statusProp.status.options;
        console.log('Valid Status Options:', options.map(o => o.name).join(', '));
        // Try to find 'Published', 'Live', 'Done', or use the last one (usually 'Done')
        const target = ['Published', 'Live', 'Done', 'Complete'].find(t => options.some(o => o.name.toLowerCase() === t.toLowerCase())) || options[options.length - 1].name;
        console.log(`✅ Using Status: "${target}"`);
        statusPayload = { status: { name: target } };
    } else if (statusProp.type === 'select') {
        statusPayload = { select: { name: 'Published' } };
    } else {
        console.log('⚠️ Status property incorrect type:', statusProp.type);
        return;
    }

    // 2. Fetch Old Posts
    const oldRes = await fetch(`https://api.notion.com/v1/databases/${OLD_BLOG_ID}/query`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28`, 'Content- Type': 'application / json' }
  });
    const oldPosts = (await oldRes.json()).results || [];
    console.log(`Found ${oldPosts.length} posts to clone.`);

    // 3. Clone Loop
    let successCount = 0;
    for (const oldPost of oldPosts) {
        const title = oldPost.properties.Title?.title?.[0]?.plain_text || 'Untitled';
        const content = oldPost.properties.Content?.rich_text || oldPost.properties['Post Body']?.rich_text || [];
        const contentText = content.map(c => c.plain_text).join('');
        const excerpt = contentText.substring(0, 150) + '...';

        // Branch logic
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
                'Status': statusPayload,
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
            };

            // Only add content if it's safe (not too long for a single property update)
            // Splitting content into blocks is better, but property update is faster if it fits. 
            // We'll try property update first. If it fails (likely due to length), we'll retry without content property and append blocks later? 
            // For now, let's just slice it to be safe 2000 chars.
            if(content.length > 0) {
                payload.properties['Content'] = { rich_text: [{ text: { content: contentText.substring(0, 1800) } }] };
    }

    try {
        const createRes = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            console.log(`❌ Failed "${title}":`, (await createRes.text()).substring(0, 100)); // Log short error
        } else {
            successCount++;
            if (successCount % 10 === 0) console.log(`... Cloned ${successCount} posts`);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}
console.log(`✅ FINISHED: ${successCount} / ${oldPosts.length} posts cloned successfully.`);
}

cloneFinal();
