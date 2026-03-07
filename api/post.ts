export default async function handler(req: any, res: any) {
    const { slug } = req.query

    const TOKEN = (process.env.NOTION_API_KEY || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error('Vercel Config Error: Missing Notion Configuration.')

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
        const page = queryData.results.find((p: any) => {
            const title = p.properties.Title?.title[0]?.plain_text || ""
            return title === slug || encodeURIComponent(title) === encodeURIComponent(slug || "")
        })

        if (!page) return res.status(404).json({ error: 'Post not found' })

        const pageId = page.id
        const props = page.properties

        // 2. Get blocks (Page Content)
        const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28'
            }
        })
        const blocksData = await blocksResponse.json()

        // Extract content from "Content" property (was Post Body)
        const postBodyRichText = props['Content']?.rich_text || []
        const propertyContent = postBodyRichText.map((t: any) => t.plain_text).join('')

        // Extract CTA 1
        // Look for 'CTA' (new) or 'CTA 1' (legacy)
        const ctaRichText = props['CTA']?.rich_text || props['CTA 1']?.rich_text || []
        const ctaData = ctaRichText.map((t: any) => ({
            text: t.plain_text,
            link: t.href || null,
            bold: t.annotations?.bold || false
        }))

        // Extract image from "Files & media" property
        const files = props['Files & media']?.files || []
        const imageUrl = files.length > 0
            ? (files[0].external?.url || files[0].file?.url || '')
            : (page.cover?.external?.url || page.cover?.file?.url || '')

        const post = {
            title: props.Title?.title[0]?.plain_text || 'Untitled',
            date: props['Publish Date']?.date?.start || '',
            category: props.Branch?.select?.name || 'Mind',
            image: imageUrl,
            propertyContent: propertyContent,
            cta1: ctaData,
            blocks: blocksData.results || []
        }

        return res.status(200).json(post)

    } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Failed to fetch blog post' })
    }
}
