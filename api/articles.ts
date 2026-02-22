import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
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

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        // Use 'any' here to bypass Vercel's strict type check on the SDK namespace
        const response = await (notion.databases as any).query({
            database_id: BLOG_DB_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }
            },
            sorts: [{ property: 'Publish Date', direction: 'descending' }],
        })

        const articles = (response.results as any[]).map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            const publishDate = props['Publish Date']?.date?.start || ''

            const contentRichText = props['Content']?.rich_text || []
            const content = contentRichText.map((t: any) => t.plain_text).join('')

            const excerptRichText = props['Excerpt']?.rich_text || props['Meta Description']?.rich_text || []
            const excerpt = excerptRichText.map((t: any) => t.plain_text).join('')

            const ctaRichText = props['CTA']?.rich_text || []
            const cta = ctaRichText.map((t: any) => t.plain_text).join('')

            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                title: props.Title?.title?.[0]?.plain_text || 'Untitled',
                excerpt,
                content,
                cta,
                coverImage: page.cover?.external?.url || page.cover?.file?.url || props['Files & media']?.files?.[0]?.file?.url || props['Files & media']?.files?.[0]?.external?.url || '',
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
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || props['Trigger']?.rich_text?.[0]?.plain_text || '',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
        return res.status(200).json(articles)
    } catch (error: any) {
        console.error('Failed to fetch articles:', error.message)
        return res.status(500).json({ error: 'Failed to fetch articles', message: error.message })
    }
}
