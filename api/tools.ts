import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOOLS_KEY })
const TOOLS_DB_ID = process.env.NOTION_TOOLS_DB_ID!

// Branch → color map (matches branches.ts)
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
            database_id: TOOLS_DB_ID,
            filter: {
                or: [
                    {
                        property: 'Status',
                        status: { equals: 'Published' }
                    },
                    {
                        property: 'Status',
                        status: { equals: 'Scheduled' }
                    }
                ]
            },
            sorts: [{ property: 'Name', direction: 'ascending' }],
        })

        const tools = response.results.map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                emoji: props.Emoji?.rich_text?.[0]?.plain_text || '🔧',
                name: props.Name?.title?.[0]?.plain_text || 'Untitled',
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                category: branch,
                branchColor: BRANCH_COLORS[branch] || '#F5C614',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(tools)
    } catch (error) {
        console.error('Failed to fetch tools:', error)
        return res.status(500).json({ error: 'Failed to fetch tools' })
    }
}
