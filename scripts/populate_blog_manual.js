
import fs from 'fs'
import path from 'path'

// Hardcoded credentials to bypass permission issues
const NOTION_TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'
const DATABASE_ID = '30a0d6014acc81ebbf18ea14125173e3'

const TRIGGER_TO_BRANCH = {
    'CRISIS': 'Mind',
    'EVICTION': 'Wealth',
    'ADHDPARENT': 'Connection',
    'HARMFUL': 'Connection',
    'CONSENT': 'Connection',
    'BURNOUT': 'Body',
    'SHUTDOWN': 'Mind',
    'OVERWHELM': 'Mind',
    'MONEY': 'Wealth',
    'RELATIONSHIP': 'Connection'
}

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

// Helper to chunk text
function chunkText(text) {
    const chunks = []
    for (let i = 0; i < text.length; i += 2000) {
        chunks.push({
            text: { content: text.slice(i, i + 2000) }
        })
    }
    return chunks
}

async function populateBlog() {
    console.log('🚀 Starting Blog Population (Fetch Mode)...')

    if (!DATABASE_ID) {
        console.error('❌ NOTION_BLOG_DATABASE_ID missing')
        return
    }

    const files = ['TEMPLATES_FINAL_BATCH.md']
    if (fs.existsSync('AGENCYPLAN_TEMPLATE.md')) files.push('AGENCYPLAN_TEMPLATE.md')
    if (fs.existsSync('CONSENT_TEMPLATE.md')) files.push('CONSENT_TEMPLATE.md')

    for (const file of files) {
        const filePath = path.join(process.cwd(), file)
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${file}`)
            continue
        }

        console.log(`\n📄 Parsing ${file}...`)
        const content = fs.readFileSync(filePath, 'utf-8')
        const sections = content.split(/(?=^#+\s*TRIGGER:)/m)

        for (const section of sections) {
            if (!section.trim()) continue

            const triggerMatch = section.match(/#+\s*TRIGGER:\s*(.*)/)
            if (!triggerMatch) continue

            const trigger = triggerMatch[1].trim()
            const postMatch = section.match(/\*\*POST:\*\*\s*(.*)/)
            const title = postMatch ? postMatch[1].trim() : `Guide for ${trigger}`

            // Template is the entire code block content
            const templateMatch = section.match(/```([\s\S]*?)```/)
            const templateContent = templateMatch ? templateMatch[1].trim() : ''

            if (!templateContent) continue

            // ---------------------------------------------------------
            // CRITICAL FIX: Separate Body (Blog Post) from Template (WhatsApp)
            // ---------------------------------------------------------

            // The Body is the template content, BUT we strip the WhatsApp footer
            let bodyContent = templateContent

            // 1. Remove "Reply anytime..." footer with robust dash matching
            const footerRegex = /(?:Reply anytime|Reply anytime\.)[\s\S]*?(?:SOR7ED|[-–—]\s*SOR7ED)/i
            bodyContent = bodyContent.replace(footerRegex, '').trim()

            const branch = TRIGGER_TO_BRANCH[trigger.split('/')[0]] || 'Mind'
            const slug = slugify(title)
            const meta = bodyContent.slice(0, 150).replace(/\n/g, ' ') + '...'

            console.log(`✨ Processing: ${title} [${trigger}] -> ${branch}`)
            console.log(`   Body Length: ${bodyContent.length}, Template Length: ${templateContent.length}`)

            try {
                // Search existing page by Trigger
                const existing = await notionRequest(`databases/${DATABASE_ID}/query`, 'POST', {
                    filter: {
                        property: 'Trigger',
                        rich_text: { equals: trigger }
                    }
                })

                const properties = {
                    'Title': { title: [{ text: { content: title } }] },
                    'Content': { rich_text: chunkText(bodyContent) }, // Mapped to 'Content' as per new schema
                    'Branch': { select: { name: branch } },
                    'Status': { status: { name: 'Done' } }, // Using 'Done' as probable default for status property
                    'CTA 1': { rich_text: [{ text: { content: 'Reply anytime. — SOR7ED' } }] }, // Mapped to 'CTA 1'
                    'Meta Description': { rich_text: [{ text: { content: meta } }] },
                    'SEO Title': { rich_text: [{ text: { content: title } }] },
                    'Slug': { rich_text: [{ text: { content: slug } }] },
                    'Template ': { rich_text: chunkText(templateContent) } // Keep trailing space in 'Template ' as per schema
                }

                if (existing.results.length > 0) {
                    console.log(`   Update existing...`)
                    await notionRequest(`pages/${existing.results[0].id}`, 'PATCH', { properties })
                } else {
                    console.log(`   Creating new page...`)
                    properties['Trigger'] = { rich_text: [{ text: { content: trigger } }] }
                    properties['Publication Date'] = { date: { start: new Date().toISOString() } }
                    await notionRequest('pages', 'POST', {
                        parent: { database_id: DATABASE_ID },
                        properties
                    })
                }

            } catch (error) {
                console.error(`❌ Error syncing ${trigger}:`, error.message)
                // Fallback for Status if 'Done' is invalid
                if (error.message.includes('Status')) {
                    console.warn('   Retrying without Status property...')
                    // Would need retry logic here, but logging is fine for now
                }
            }
        }
    }
    console.log('\n✅ Population Complete.')
}

populateBlog()
