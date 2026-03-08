import type { VercelRequest, VercelResponse } from '@vercel/node'

const NOTION_API_KEY = (process.env.NOTION_API_KEY || '').trim()
const BLOG_DB_ID = (process.env.NOTION_BLOG_DB_ID || '').trim()

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        if (!NOTION_API_KEY || !BLOG_DB_ID) {
            console.error('Missing Notion Configuration: NOTION_API_KEY or NOTION_BLOG_DB_ID')
            return res.status(500).json({ error: 'System configuration error' })
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    status: { equals: 'Published' }
                },
                sorts: [{ property: 'Publish Date', direction: 'descending' }]
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', errorBody)
            return res.status(response.status).json({ error: 'Notion connection failed' })
        }

        const data = await response.json()
        if (!data.results) {
            return res.status(200).json([])
        }

        const articles = data.results.map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            const publishDate = props['Publish Date']?.date?.start || ''

            const contentRichText = props['Content']?.rich_text || []
            const rawContent = contentRichText.map((t: any) => t.plain_text).join('')
            // Strip boilerplate footers added during content generation
            const content = rawContent
                .replace(/READY TO HAND THIS OFF\?[\s\S]*?(?=\n\n|\n#|$)/gi, '')
                .replace(/Text\s+\w+\s+to\s+\+[\d\s]+for[\s\S]*?(?=\n\n|\n#|$)/gi, '')
                .replace(/\[End of Post\]/gi, '')
                .trim()

            const excerptRichText = props['Excerpt']?.rich_text || props['Meta Description']?.rich_text || []
            const excerpt = excerptRichText.map((t: any) => t.plain_text).join('')

            const ctaRichText = props['CTA']?.rich_text || []
            const cta = ctaRichText.map((t: any) => t.plain_text).join('')

            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                title: props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'Untitled',
                excerpt,
                content,
                cta,
                coverImage: page.cover?.external?.url || page.cover?.file?.url || props['Cover Image URL']?.rich_text?.[0]?.plain_text || props['Files & media']?.files?.[0]?.file?.url || props['Files & media']?.files?.[0]?.external?.url || '',
                branch,
                branchColor: '#F5C614',
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
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

