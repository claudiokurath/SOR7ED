
// Hardcoded credentials to bypass permission issues
const NOTION_TOKEN = 'ntn_m35904089086ppdrvL5RvYTm4gSHMn8Iibaj44dCC2daef'
const OLD_DATABASE_ID = '2d80d6014acc8057bbb9e15e74bf70c6' // Old
const NEW_DATABASE_ID = '30a0d6014acc81809644c6769eebefac' // New

function slugify(text) {
    if (!text) return ''
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

async function notionRequest(endpoint, method, body) {
    const url = `https://api.notion.com/v1/${endpoint}`
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Notion API Error: ${response.status} ${text}`)
    }

    return response.json()
}

async function migrateBlog() {
    console.log('🚀 Starting Blog Migration from OLD DB to NEW DB...')

    if (!NEW_DATABASE_ID || !OLD_DATABASE_ID) {
        console.error('❌ Database IDs missing')
        return
    }

    try {
        // 1. Fetch all posts from the OLD database
        console.log(`📥 Fetching posts from OLD DB (${OLD_DATABASE_ID})...`)
        let hasMore = true
        let cursor = undefined
        const pages = []

        while (hasMore) {
            const body = cursor ? { start_cursor: cursor } : {}
            const response = await notionRequest(`databases/${OLD_DATABASE_ID}/query`, 'POST', body)
            pages.push(...response.results)
            hasMore = response.has_more
            cursor = response.next_cursor
        }

        console.log(`✅ Found ${pages.length} posts to migrate.`)

        // 2. Iterate and insert into NEW database
        for (const page of pages) {
            const props = page.properties

            // Extract values safely from old properties
            // The mapping might be tricky depending on exact property names in old DB
            // We try to guess common ones based on previous context

            const extractText = (prop) => prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || ''
            const extractSelect = (prop) => prop?.select?.name || prop?.status?.name || 'Published'

            // MAPPING
            const title = extractText(props['Name'] || props['Blog Title'] || props['Title'])
            const oldBody = extractText(props['Post Body'] || props['Blog Post Body'] || props['Body'] || props['Content'])
            const trigger = extractText(props['Trigger'] || props['Keyword'])
            const branch = extractSelect(props['Branch']) || 'Mind'
            const template = extractText(props['Template'] || props['Template '])
            const status = 'Published' // Force published for migration
            const cta = extractText(props['CTA'] || props['CTA ']) || 'Reply anytime. — SOR7ED'
            const slug = extractText(props['Slug']) || slugify(title)
            const seoTitle = extractText(props['SEO Title']) || title
            const meta = extractText(props['Meta Description']) || oldBody.slice(0, 150)

            // Note: Image handling is complex (files property expiry), we might skip or try to copy URLs if external
            const image = props['Image']?.files || []

            // Helper to chunk text
            function chunkText(text) {
                const chunks = []
                for (let i = 0; i < text.length; i += 2000) {
                    chunks.push({
                        text: { content: text.slice(i, i + 2000) }
                    })
                }
                return chunks
            }

            console.log(`✨ Migrating: ${title} [${trigger}]`)
            // console.log(`   Body Length: ${oldBody.length}`)

            if (!title) {
                console.warn('   ⚠️ Skipping due to missing Title')
                continue
            }

            // Check if exists in new DB
            const existing = await notionRequest(`databases/${NEW_DATABASE_ID}/query`, 'POST', {
                filter: {
                    property: 'Trigger',
                    rich_text: { equals: trigger }
                }
            })

            const newProperties = {
                'Title': { title: [{ text: { content: title } }] },
                'Body': { rich_text: chunkText(oldBody) },
                'Branch': { select: { name: branch } },
                'Status': { select: { name: status } }, // Changed to Select as per reliable schema restore
                'Trigger': { rich_text: [{ text: { content: trigger } }] },
                'CTA ': { rich_text: [{ text: { content: cta } }] },
                'Meta Description': { rich_text: [{ text: { content: meta } }] },
                'SEO Title': { rich_text: [{ text: { content: seoTitle } }] },
                'Slug': { rich_text: [{ text: { content: slug } }] },
                'Template ': { rich_text: chunkText(template) }
                // 'Image': { files: image } // Skipping images to prevent errors for now
            }

            if (existing.results.length > 0) {
                console.log(`   Update existing entry in NEW DB...`)
                await notionRequest(`pages/${existing.results[0].id}`, 'PATCH', { properties: newProperties })
            } else {
                console.log(`   Creating new entry in NEW DB...`)
                newProperties['Publication Date'] = { date: { start: new Date().toISOString() } }
                await notionRequest('pages', 'POST', {
                    parent: { database_id: NEW_DATABASE_ID },
                    properties: newProperties
                })
            }
        }

        console.log('\n✅ Migration Complete.')

    } catch (error) {
        console.error('❌ Migration failed:', error.message)
    }
}

migrateBlog()
