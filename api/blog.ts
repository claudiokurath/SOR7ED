import { Client } from '@notionhq/client'

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) {
            console.error('Missing Environment Variables for Blog API')
            return res.status(200).json([]) // Return empty list to avoid crashing UI
        }

        const notion = new Client({ auth: TOKEN })

        // STRICT FILTER: Only 'Published' status
        const response = await notion.databases.query({
            database_id: DB_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }
            },
            sorts: [{
                property: 'Publication Date',
                direction: 'descending'
            }]
        })

        const posts = response.results.map((page: any) => {
            const props = page.properties
            return {
                title: props.Title?.title[0]?.plain_text || 'Untitled',
                date: props['Publication Date']?.date?.start || '',
                category: props.Branch?.select?.name || 'Mind',
                readTime: '5 min'
            }
        })

        console.log(`Successfully fetched ${posts.length} published posts from Notion.`)
        return res.status(200).json(posts)

    } catch (error: any) {
        console.error('Notion Blog Sync Error:', error.message)
        // Return clear error if integration is not shared with DB
        if (error.code === 'object_not_found') {
            return res.status(200).json([{ title: "🛠️ ERROR: Notion DB not shared with integration", date: "Now", category: "Config" }])
        }
        return res.status(200).json([])
    }
}
