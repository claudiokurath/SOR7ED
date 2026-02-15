import { Client } from '@notionhq/client'

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) {
            throw new Error('Vercel Config Error: NOTION_BLOG_TOKEN or NOTION_BLOG_DATABASE_ID missing.')
        }

        const notion = new Client({ auth: TOKEN })

        // Fetching Published and Done posts
        const response = await notion.databases.query({
            database_id: DB_ID,
            filter: {
                or: [
                    {
                        property: 'Status',
                        status: { equals: 'Published' }
                    },
                    {
                        property: 'Status',
                        status: { equals: 'Done' }
                    }
                ]
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
                category: props.Branch?.select?.name || 'Protocol',
                readTime: '5 min' // Defaulting since property is missing in DB
            }
        })

        return res.status(200).json(posts)
    } catch (error: any) {
        console.error('Notion Blog Error:', error)
        return res.status(500).json({ error: error.message || 'Failed to fetch blog posts' })
    }
}
