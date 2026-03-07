export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    const TOKEN = (process.env.NOTION_API_KEY || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    status: { equals: 'Published' }
                },
                sorts: [{
                    property: 'Publish Date',
                    direction: 'descending'
                }]
            })
        })

        if (!response.ok) throw new Error("Notion API Connection Failed.")

        const data = await response.json()
        const posts = data.results.map((page: any) => {
            const props = page.properties

            // 1. Extract image from "Files & media" property
            const files = props['Files & media']?.files || []
            const imageUrl = files.length > 0
                ? (files[0].external?.url || files[0].file?.url || '')
                : (page.cover?.external?.url || page.cover?.file?.url || '')

            // 2. Extract excerpt from "Content" property (was "Post Body")
            const bodyRichText = props['Content']?.rich_text || []
            const fullBody = bodyRichText.map((t: any) => t.plain_text).join('')
            const excerpt = fullBody.length > 120 ? fullBody.substring(0, 117) + '...' : fullBody

            return {
                id: page.id,
                title: props.Title?.title[0]?.plain_text || 'Untitled',
                date: props['Publish Date']?.date?.start || '',
                category: props.Branch?.select?.name || 'Mind',
                readTime: '5 min',
                image: imageUrl,
                excerpt: excerpt,
                slug: props.Slug?.rich_text[0]?.plain_text || '' // Added Slug
            }
        })

        return res.status(200).json(posts)
    } catch (error: any) {
        console.error('Blog Sync Error:', error)
        return res.status(200).json([])
    }
}
