import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_BLOG_KEY })
const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID!

const BRANCH_COLORS: Record<string, string> = {
    MIND: '#9B59B6',
    WEALTH: '#27AE60',
    BODY: '#E74C3C',
    TECH: '#3498DB',
    CONNECTION: '#E67E22',
    IMPRESSION: '#F39C12',
    GROWTH: '#16A085',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const response = await notion.databases.query({
            database_id: BLOG_DB_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }, // Changed from select to status to match your DB schema
            },
            sorts: [{ property: 'Publish Date', direction: 'descending' }],
        })

        const articles = response.results.map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            const publishDate = props['Publish Date']?.date?.start || ''

            // detailed content for single post view
            const content = props.Content?.rich_text?.[0]?.plain_text || ''
            const cta = props.CTA?.rich_text?.[0]?.plain_text || ''
            const coverImage = page.cover?.external?.url || page.cover?.file?.url || props['Files & media']?.files?.[0]?.file?.url || props['Files & media']?.files?.[0]?.external?.url || ''

            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                title: props.Title?.title?.[0]?.plain_text || 'Untitled',
                excerpt: props['Excerpt']?.rich_text?.[0]?.plain_text || props['Meta Description']?.rich_text?.[0]?.plain_text || '',
                content,
                cta,
                coverImage,
                branch,
                branchColor: BRANCH_COLORS[branch] || '#F5C614',
                readTime: props['Read Time']?.rich_text?.[0]?.plain_text || '',
                date: publishDate
                    ? new Date(publishDate).toLocaleDateString('en-GB', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })
                    : '',
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(articles)
    } catch (error) {
        console.error('Failed to fetch articles:', error)
        return res.status(500).json({ error: 'Failed to fetch articles' })
    }
}
