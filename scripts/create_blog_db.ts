import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_TOOLS_TOKEN })
const parentPageId = process.env.NOTION_PARENT_PAGE_ID // You need a parent page ID to host the database

async function setupBlogDatabase() {
    console.log('🚀 Setting up new Blog Database...')

    if (!parentPageId) {
        console.error('❌ NOTION_PARENT_PAGE_ID missing. Please set it in your .env file.')
        return
    }

    try {
        const response = await notion.databases.create({
            parent: {
                page_id: parentPageId,
            },
            title: [
                {
                    type: 'text',
                    text: {
                        content: 'SOR7ED Blog',
                    },
                },
            ],
            properties: {
                'Blog Title': {
                    title: {},
                },
                'Blog Content': {
                    rich_text: {},
                },
                'Branch': {
                    select: {
                        options: [
                            { name: 'Mind', color: 'blue' },
                            { name: 'Body', color: 'green' },
                            { name: 'Connection', color: 'purple' },
                            { name: 'Wealth', color: 'yellow' },
                            { name: 'Growth', color: 'orange' },
                            { name: 'Impression', color: 'red' },
                            { name: 'Tech', color: 'gray' }
                        ]
                    }
                },
                'Status': {
                    select: {
                        options: [
                            { name: 'Draft', color: 'gray' },
                            { name: 'Review', color: 'yellow' },
                            { name: 'Published', color: 'green' }
                        ],
                    },
                },
                'Image': {
                    files: {},
                },
                'Trigger': {
                    rich_text: {},
                },
                'CTA': {
                    rich_text: {},
                },
                'Meta Description': {
                    rich_text: {},
                },
                'SEO Title': {
                    rich_text: {},
                },
                'Slug': {
                    rich_text: {},
                },
                'Publication Date': {
                    date: {},
                },
                'Template': {
                    rich_text: {},
                },
            },
        })

        console.log('✅ New Blog Database Created!')
        console.log('🔗 Database ID:', response.id)
        console.log('🔗 View it here:', response.url)
        console.log('\n⚠️  Please update your .env file with this new Database ID as NOTION_BLOG_DATABASE_ID')

    } catch (error: any) {
        console.error('❌ Error creating database:', error.message)
    }
}

setupBlogDatabase()
