export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    const TOKEN = (process.env.NOTION_TOOLS_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error("Vercel Config Error: Missing Tools Config.")

        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Public',
                    checkbox: { equals: true }
                },
                page_size: 100
            })
        })

        if (!response.ok) throw new Error("Notion Tools API Failed.")

        const data = await response.json()
        const tools = data.results.map((page: any) => {
            const props = page.properties
            return {
                name: props.Name?.title[0]?.plain_text || 'Unnamed Tool',
                icon: props.Icon?.rich_text[0]?.plain_text || '⚒️',
                desc: props.Description?.rich_text[0]?.plain_text || props.desc?.rich_text[0]?.plain_text || '',
                keyword: props.Keyword?.rich_text[0]?.plain_text || '',
                isPublic: true // Since we filtered for public ones
            }
        })

        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Tools Sync Error:', error)
        return res.status(200).json([])
    }
}
