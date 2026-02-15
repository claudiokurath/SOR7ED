import { Client } from '@notionhq/client'

export default async function handler(req: any, res: any) {
    const { slug } = req.query

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) {
            throw new Error('Vercel Config Error: NOTION_BLOG_TOKEN or NOTION_BLOG_DATABASE_ID missing.')
        }

        const notion = new Client({ auth: TOKEN })

        // 1. Find the page by title (slug)
        const response = await notion.databases.query({
            database_id: DB_ID,
            filter: {
                property: 'Title',
                title: { equals: slug }
            }
        })

        if (response.results.length === 0) {
            return res.status(404).json({ error: 'Post not found' })
        }

        const pageId = response.results[0].id
        const props: any = (response.results[0] as any).properties

        // 2. Get content blocks
        const blocks = await notion.blocks.children.list({ block_id: pageId })

        // 3. Construct post object
        const post = {
            title: props.Title?.title[0]?.plain_text || 'Untitled',
            date: props['Publication Date']?.date?.start || '',
            category: props.Branch?.select?.name || 'Mind',
            image: (response.results[0] as any).cover?.external?.url || (response.results[0] as any).cover?.file?.url || '',
            blocks: blocks.results
        }

        return res.status(200).json(post)
    } catch (error: any) {
        console.error('Notion Post Fetch Error:', error)
        return res.status(500).json({ error: error.message || 'Failed to fetch blog post' })
    }
}
