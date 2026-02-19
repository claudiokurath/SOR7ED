
import fs from 'fs'

const DB_ID = '30a0d6014acc81ebbf18ea14125173e3'
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'

async function notionRequest(endpoint, method, body) {
    const response = await fetch(`https://api.notion.com/v1/${endpoint}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
        throw new Error(`Notion API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

async function deduplicatePosts() {
    console.log('🚀 Starting Deduplication...')

    let hasMore = true
    let startCursor = undefined
    const allPosts = []

    // 1. Fetch ALL posts
    while (hasMore) {
        const query = await notionRequest(`databases/${DB_ID}/query`, 'POST', {
            page_size: 100,
            start_cursor: startCursor
        })
        allPosts.push(...query.results)
        hasMore = query.has_more
        startCursor = query.next_cursor
    }

    console.log(`Analyzing ${allPosts.length} posts...`)

    // 2. Group by Title
    const byTitle = {}
    for (const post of allPosts) {
        const title = post.properties.Title?.title[0]?.plain_text || 'Untitled'
        if (!byTitle[title]) byTitle[title] = []
        byTitle[title].push(post)
    }

    // 3. Find Duplicates
    let duplicatesFound = 0
    let deletedCount = 0

    for (const [title, posts] of Object.entries(byTitle)) {
        if (posts.length > 1) {
            console.log(`⚠️ Found ${posts.length} copies of: "${title}"`)
            duplicatesFound++

            // Sort by "Enhanced" status (prefer ones with '— SOR7ED')
            // Then by Last Edited Time (newest first)
            posts.sort((a, b) => {
                const aContent = a.properties.Content?.rich_text.map(t => t.plain_text).join('') || ''
                const bContent = b.properties.Content?.rich_text.map(t => t.plain_text).join('') || ''
                const aEnhanced = aContent.includes('— SOR7ED')
                const bEnhanced = bContent.includes('— SOR7ED')

                if (aEnhanced && !bEnhanced) return -1 // a comes first
                if (!aEnhanced && bEnhanced) return 1  // b comes first

                // If tie, sort by updated time (newest first)
                return new Date(b.last_edited_time) - new Date(a.last_edited_time)
            })

            // Keep index 0, Delete rest
            const toKeep = posts[0]
            const toDelete = posts.slice(1)

            console.log(`   ✅ Keeping: ${toKeep.id} (Enhanced: ${toKeep.properties.Content?.rich_text.map(t => t.plain_text).join('').includes('— SOR7ED')})`)

            for (const p of toDelete) {
                console.log(`   ❌ Deleting: ${p.id}`)
                try {
                    await notionRequest(`pages/${p.id}`, 'PATCH', { archived: true })
                    deletedCount++
                } catch (e) {
                    console.error(`Failed to delete ${p.id}:`, e)
                }
            }
        }
    }

    if (duplicatesFound === 0) {
        console.log('✅ No duplicates found.')
    } else {
        console.log(`\n✅ Deduplication Complete. Removed ${deletedCount} duplicate content items.`)
    }
}

deduplicatePosts()
