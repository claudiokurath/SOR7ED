import { Client } from '@notionhq/client'

const toolsNotion = new Client({ auth: process.env.NOTION_TOOLS_TOKEN })
const TOOLS_DATABASE_ID = process.env.NOTION_TOOLS_DATABASE_ID

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        if (!TOOLS_DATABASE_ID) {
            throw new Error('NOTION_TOOLS_DATABASE_ID is not configured')
        }

        const response = await (toolsNotion.databases as any).query({
            database_id: TOOLS_DATABASE_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Live' }
            }
        })

        // Format to match our Tool interface
        const tools = response.results.map((page: any) => {
            const props = page.properties
            return {
                name: props.Name?.title[0]?.plain_text || 'Unnamed Tool',
                icon: props.Icon?.rich_text[0]?.plain_text || '⚒️',
                desc: props.Description?.rich_text[0]?.plain_text || '',
                keyword: props.Keyword?.rich_text[0]?.plain_text || '',
                isPublic: props.Public?.checkbox || false
            }
        })

        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Notion Tools Error:', error)
        return res.status(500).json({ error: 'Failed to fetch tools' })
    }
}
