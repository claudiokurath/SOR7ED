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
    const NOTION_TOKEN = process.env.NOTION_BLOG_KEY || process.env.NOTION_API_KEY;
    const DATABASE_ID = process.env.NOTION_BLOG_DB_ID;

    if (!NOTION_TOKEN || !DATABASE_ID) {
        console.error('Missing Notion Configuration');
        return res.status(500).json({ error: 'Missing environment variables' });
    }

    try {
        const response = await notion.databases.query({
            database_id: DATABASE_ID,
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
        }

        const data = await response.json() as any;
        const articles = data.results.map((page: any) => {
            const props = page.properties;
            const branch = props.Branch?.select?.name || '';
            const publishDate = props['Publish Date']?.date?.start || '';

            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                title: props.Title?.title?.[0]?.plain_text || 'Untitled',
                excerpt: props['Excerpt']?.rich_text?.[0]?.plain_text || props['Meta Description']?.rich_text?.[0]?.plain_text || '',
                content: props['Content']?.rich_text?.[0]?.plain_text || '',
                cta: props['CTA']?.rich_text?.[0]?.plain_text || '',
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
            };
        });

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59'); // Reduce cache for testing
        return res.status(200).json(articles);
    } catch (error: any) {
        console.error('Fetch operation failed:', error.message);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
