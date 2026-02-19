
import fs from 'fs'
import path from 'path'

const NOTION_TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'
const DATABASE_ID = '30a0d6014acc81ebbf18ea14125173e3'

function slugify(text) {
    if (!text) return ''
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

async function notionRequest(endpoint, method, body) {
    const url = `https://api.notion.com/v1/${endpoint}`
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Notion API Error: ${response.status} ${text}`)
    }

    return response.json()
}

function chunkText(text) {
    const chunks = []
    for (let i = 0; i < text.length; i += 2000) {
        chunks.push({
            text: { content: text.slice(i, i + 2000) }
        })
    }
    return chunks
}

function inferBranch(text) {
    const t = text.toLowerCase()
    if (t.includes('code') || t.includes('tech') || t.includes('software')) return 'Tech'
    if (t.includes('money') || t.includes('wealth') || t.includes('income')) return 'Wealth'
    if (t.includes('sex') || t.includes('intimacy') || t.includes('kink') || t.includes('relationship')) return 'Connection'
    if (t.includes('drug') || t.includes('meds') || t.includes('substance') || t.includes('pain')) return 'Body'
    if (t.includes('autism') || t.includes('sensory')) return 'Impression' // Or Mind?
    if (t.includes('adhd') || t.includes('bipolar') || t.includes('dyslexia')) return 'Mind'
    return 'Mind'
}

async function populateNewPosts() {
    console.log('🚀 Populating New Blog Posts...')

    const filePath = path.join(process.cwd(), 'NEW_POSTS.md')
    if (!fs.existsSync(filePath)) {
        console.error('NEW_POSTS.md not found')
        return
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    // Split by header "## Number. Title"
    const posts = content.split(/^## \d+\.\s+/m).slice(1) // skip first empty

    for (const postRaw of posts) {
        const lines = postRaw.split('\n')
        const titleRaw = lines[0].trim()
        const bodyContent = postRaw.substring(titleRaw.length).trim()

        // Extract Template from "Reflection Framework" or "Tailored Template"
        const templateMatch = bodyContent.match(/(?:\*\*Reflection Framework\*\*|\*\*Tailored Template:.*?\*\*)\s*([\s\S]*)/i)
        const templateContent = templateMatch ? templateMatch[1].trim() : "Reply anytime for a tailored template."

        const title = titleRaw
        const slug = slugify(title)
        const branch = inferBranch(title + ' ' + bodyContent)
        const trigger = slug.toUpperCase().replace(/-/g, '_')

        // Use full body content for Blog Post properties
        const contentForBlog = bodyContent

        console.log(`✨ Processing: ${title}`)
        console.log(`   Branch: ${branch}`)

        try {
            // Check existence by matching Title to avoid duplicates
            const existing = await notionRequest(`databases/${DATABASE_ID}/query`, 'POST', {
                filter: {
                    property: 'Title',
                    title: { equals: title }
                }
            })

            const properties = {
                'Title': { title: [{ text: { content: title } }] },
                'Content': { rich_text: chunkText(contentForBlog) },
                'Branch': { select: { name: branch } },
                'Status': { status: { name: 'Done' } },
                'CTA 1': { rich_text: [{ text: { content: 'Reply anytime. — SOR7ED' } }] },
                'Meta Description': { rich_text: [{ text: { content: contentForBlog.slice(0, 150) } }] },
                'SEO Title': { rich_text: [{ text: { content: title } }] },
                'Slug': { rich_text: [{ text: { content: slug } }] },
                'Template ': { rich_text: chunkText(templateContent) }, // Populate Template with Framework
                'Trigger': { rich_text: [{ text: { content: trigger } }] }
            }

            if (existing.results.length > 0) {
                console.log(`   Update existing...`)
                await notionRequest(`pages/${existing.results[0].id}`, 'PATCH', { properties })
            } else {
                console.log(`   Creating new page...`)
                properties['Publication Date'] = { date: { start: new Date().toISOString() } }
                await notionRequest('pages', 'POST', {
                    parent: { database_id: DATABASE_ID },
                    properties
                })
            }

        } catch (error) {
            console.error(`❌ Error syncing ${title}:`, error.message)
        }
    }
    console.log('\n✅ New Posts Populated.')
}

populateNewPosts()
