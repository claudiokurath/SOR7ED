export default async function handler(req: any, res: any) {
    const { slug } = req.query

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error('Vercel Config Error: Missing Notion Configuration.')

        // 1. Fetch all pages to find the one with the matching title
        // This is more robust than "equals" filters which are sensitive to minor formatting
        const queryResponse = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 100 })
        })

        if (!queryResponse.ok) throw new Error("Notion API Connection Failed.")

        const queryData = await queryResponse.json()

        // Find the page where Title matches the slug
        const page = queryData.results.find((p: any) => {
            const title = p.properties.Title?.title[0]?.plain_text || ""
            return title === slug || encodeURIComponent(title) === encodeURIComponent(slug || "")
        })

        if (!page) {
            console.error(`Post not found in Notion for slug: ${slug}`)
            return res.status(404).json({ error: 'Post not found' })
        }

        const pageId = page.id
        const props = page.properties

        // 2. Get content blocks
        const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28'
            }
        })

        if (!blocksResponse.ok) throw new Error("Failed to fetch page content blocks.")

        const blocksData = await blocksResponse.json()

        // 3. Construct post object
        const post = {
            title: props.Title?.title[0]?.plain_text || 'Untitled',
            date: props['Publication Date']?.date?.start || '',
            category: props.Branch?.select?.name || 'Mind',
            image: page.cover?.external?.url || page.cover?.file?.url || '',
            blocks: blocksData.results
        }

        return res.status(200).json(post)

    } catch (error: any) {
        console.error('Post Sync Error:', error.message)
        return res.status(500).json({ error: error.message || 'Failed to fetch blog post' })
    }
}
