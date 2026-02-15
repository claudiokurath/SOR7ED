import { Client } from '@notionhq/client'

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const TOKEN = (process.env.NOTION_TOOLS_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) {
            throw new Error('Vercel Config Error: NOTION_TOOLS_TOKEN or NOTION_TOKEN missing.')
        }

        const notion = new Client({ auth: TOKEN })

        // Fetching all tools (filtering out clearly inactive ones if property exists)
        const response = await notion.databases.query({
            database_id: DB_ID,
            // We'll show everything that isn't explicitly 'Archived' if the property exists
            // For now, let's just fetch everything to ensure the UI isn't empty
            page_size: 100
        })

        const tools = response.results.map((page: any) => {
            const props = page.properties
            return {
                name: props.Name?.title[0]?.plain_text || 'Unnamed Tool',
                icon: props.Icon?.rich_text[0]?.plain_text || '⚒️',
                desc: props.Description?.rich_text[0]?.plain_text || props.desc?.rich_text[0]?.plain_text || '',
                keyword: props.Keyword?.rich_text[0]?.plain_text || '',
                isPublic: props.Public?.checkbox || false
            }
        })

        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Notion Tools Error:', error)
        return res.status(500).json({ error: error.message || 'Failed to fetch tools' })
    }
}
