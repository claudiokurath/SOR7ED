import type { VercelRequest, VercelResponse } from '@vercel/node'

const NOTION_API_KEY = (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim()
const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || "08ac767d313845ca91886ce45c379b99").trim()

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        if (!NOTION_API_KEY || !TOOLS_DB_ID) {
            return res.status(500).json({ error: 'Tools configuration missing' })
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${TOOLS_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    or: [
                        { property: 'Status', status: { equals: 'Done' } },
                        { property: 'Status', status: { equals: 'Published' } },
                        { property: 'Status', status: { equals: 'Live' } }
                    ]
                }
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error (Tools):', errorBody)
            return res.status(response.status).json({ error: 'Notion connection failed' })
        }

        const data = await response.json()
        const tools = data.results.map((page: any) => {
            const props = page.properties

            // Extract text from rich_text arrays
            const getText = (prop: any) => prop?.rich_text?.[0]?.plain_text || ''

            return {
                id: page.id,
                name: props.Name?.title?.[0]?.plain_text || 'Unnamed Tool',
                emoji: props.Icon?.rich_text?.[0]?.plain_text || '🛠️', // Fallback if Icon exists
                description: getText(props.Description),
                whatsappKeyword: getText(props['WhatsApp Keyword']) || getText(props.Keyword) || '',
                branch: props.Branch?.select?.name || '',
                coverImage: page.cover?.external?.url ||
                    page.cover?.file?.url ||
                    props['Cover Image']?.files?.[0]?.file?.url ||
                    props['Cover Image']?.files?.[0]?.external?.url ||
                    props['Image']?.files?.[0]?.file?.url ||
                    props['Image']?.files?.[0]?.external?.url || '',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Failed to fetch tools:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
