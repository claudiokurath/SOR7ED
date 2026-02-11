import { Client } from '@notionhq/client'

// Helper to get env vars safely in Vite
const getEnv = (key: string) => {
    // @ts-ignore
    return import.meta.env[key] || '';
};

const blogNotion = new Client({ auth: getEnv('VITE_NOTION_BLOG_TOKEN') })
const toolsNotion = new Client({ auth: getEnv('VITE_NOTION_TOOLS_TOKEN') })
const crmNotion = new Client({ auth: getEnv('VITE_NOTION_CRM_TOKEN') })

const BLOG_DATABASE_ID = getEnv('VITE_NOTION_BLOG_DATABASE_ID') || '2d80d6014acc8057bbb9e15e74bf70c6'
const TOOLS_DATABASE_ID = getEnv('VITE_NOTION_TOOLS_DATABASE_ID') || '2fb0d6014acc80699332d6e01539deb2'
const CRM_DATABASE_ID = getEnv('VITE_NOTION_CRM_DATABASE_ID') || '2d80d6014acc8057bbb9e15e74bf70c6'

export async function getBlogPosts() {
    try {
        const response = await (blogNotion.databases as any).query({
            database_id: BLOG_DATABASE_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }
            },
            sorts: [{
                property: 'Publication Date',
                direction: 'descending'
            }]
        })
        return response.results
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return []
    }
}

export async function getTools() {
    try {
        const response = await (toolsNotion.databases as any).query({
            database_id: TOOLS_DATABASE_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Live' }
            }
        })
        return response.results
    } catch (error) {
        console.error('Error fetching tools:', error)
        return []
    }
}

// Save user signup to CRM
export async function saveSignup(data: {
    name: string
    email: string
    phone?: string
    template: string
}) {
    try {
        const response = await crmNotion.pages.create({
            parent: { database_id: CRM_DATABASE_ID },
            properties: {
                'Name': {
                    title: [{ text: { content: data.name } }]
                },
                'Email': {
                    email: data.email
                },
                'Phone': {
                    phone_number: data.phone || ''
                },
                'Template Requested': {
                    rich_text: [{ text: { content: data.template } }]
                },
                'Signup Date': {
                    date: { start: new Date().toISOString() }
                }
            } as any
        })
        return response
    } catch (error) {
        console.error('Error saving signup:', error)
        throw error
    }
}
