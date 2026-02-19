
import fs from 'fs'

const DB_ID = '30a0d6014acc81ebbf18ea14125173e3'
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'

async function clearPageBody() {
    console.log('🚀 Clearing Page Body (Blocks) for Blog Posts...')

    let hasMore = true
    let startCursor = undefined
    let clearedCount = 0

    while (hasMore) {
        const query = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page_size: 50,
                start_cursor: startCursor
            })
        }).then(r => r.json())

        for (const page of query.results) {
            const pageId = page.id
            const title = page.properties.Title?.title[0]?.plain_text || 'Untitled'

            // Get Blocks
            const blocks = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28'
                }
            }).then(r => r.json())

            if (blocks.results.length > 0) {
                console.log(`🧹 Clearing ${blocks.results.length} blocks from: ${title}`)
                for (const block of blocks.results) {
                    try {
                        await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`,
                                'Notion-Version': '2022-06-28'
                            }
                        })
                    } catch (e) {
                        console.error(`Error deleting block ${block.id}:`, e)
                    }
                }
                clearedCount++
            } else {
                console.log(`✅ Clean/Empty Body: ${title}`)
            }
        }

        hasMore = query.has_more
        startCursor = query.next_cursor
    }

    console.log(`\n✅ Finished. Cleared body for ${clearedCount} posts.`)
}

clearPageBody()
