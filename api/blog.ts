import { Client } from '@notionhq/client'

const blogNotion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        if (!BLOG_DATABASE_ID) {
            throw new Error('NOTION_BLOG_DATABASE_ID is not configured')
        }

        const response = await (blogNotion.databases as any).query({
            database_id: BLOG_DATABASE_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }
            },
            sorts: [{
                property: 'Publication Date',
                direction: 'descending'
            }]
        })

        // Format to match our Article interface
        const posts = response.results.map((page: any) => {
            const props = page.properties
            return {
                title: props.Title?.title[0]?.plain_text || 'Untitled',
                date: props['Publication Date']?.date?.start || '',
                category: props.Category?.select?.name || 'Uncategorized',
                readTime: props['Read Time']?.rich_text[0]?.plain_text || '5 min'
            }
        })

        return res.status(200).json(posts)
    } catch (error: any) {
        console.error('Notion Blog Error:', error)
        return res.status(500).json({ error: 'Failed to fetch blog posts' })
    }
}
