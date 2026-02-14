import { Client } from '@notionhq/client'

// @ts-ignore
const blogNotion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
// @ts-ignore
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

export default async function handler(req: any, res: any) {
    const { slug } = req.query

    try {
        if (!BLOG_DATABASE_ID) {
            throw new Error('NOTION_BLOG_DATABASE_ID is not configured')
        }

        // 1. Find the page by slug (Title)
        const response = await (blogNotion.databases as any).query({
            database_id: BLOG_DATABASE_ID,
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

        // 2. Get blocks (content)
        const blocks = await (blogNotion.blocks.children as any).list({ block_id: pageId })

        // 3. Get page details
        const post = {
            title: props.Title?.title[0]?.plain_text || 'Untitled',
            date: props['Publication Date']?.date?.start || '',
            category: props.Category?.select?.name || 'Uncategorized',
            image: (response.results[0] as any).cover?.external?.url || (response.results[0] as any).cover?.file?.url || '',
            blocks: blocks.results
        }

        return res.status(200).json(post)
    } catch (error: any) {
        console.error('Notion Post Error:', error)
        return res.status(500).json({ error: 'Failed to fetch blog post' })
    }
}
