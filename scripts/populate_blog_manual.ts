import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
// Manual .env parser to avoid dependency issues
try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf-8')
        envConfig.split('\n').forEach(line => {
            const [key, ...values] = line.split('=')
            if (key && values.length > 0) {
                process.env[key.trim()] = values.join('=').trim()
            }
        })
    }
} catch (e) {
    console.error('Error loading .env file', e)
}

const notion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
const databaseId = process.env.NOTION_BLOG_DB_ID

const TRIGGER_TO_BRANCH: Record<string, string> = {
    'CRISIS': 'Mind',
    'EVICTION': 'Wealth',
    'ADHDPARENT': 'Connection',
    'HARMFUL': 'Connection',
    // Add defaults or guesses
    'BURNOUT': 'Body',
    'SHUTDOWN': 'Mind',
    'OVERWHELM': 'Mind',
    'MONEY': 'Wealth',
    'RELATIONSHIP': 'Connection'
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
}

async function populateBlog() {
    console.log('🚀 Starting Blog Population...')

    if (!databaseId) {
        console.error('❌ NOTION_BLOG_DATABASE_ID missing')
        return
    }

    const files = ['TEMPLATES_FINAL_BATCH.md']

    // Check for other files
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
        const sections = content.split(/(?=^##\s*TRIGGER:)/m)

        for (const section of sections) {
            if (!section.trim()) continue

            const triggerMatch = section.match(/##\s*TRIGGER:\s*(.*)/)
            if (!triggerMatch) continue

            const trigger = triggerMatch[1].trim()
            const postMatch = section.match(/\*\*POST:\*\*\s*(.*)/)
            const title = postMatch ? postMatch[1].trim() : `Guide for ${trigger}`

            const templateMatch = section.match(/```([\s\S]*?)```/)
            const bodyContent = templateMatch ? templateMatch[1].trim() : ''

            if (!bodyContent) continue

            const branch = TRIGGER_TO_BRANCH[trigger.split('/')[0]] || 'Mind' // Default to Mind
            const slug = slugify(title)
            const meta = bodyContent.slice(0, 150).replace(/\n/g, ' ') + '...'

            console.log(`✨ Processing: ${title} [${trigger}] -> ${branch}`)

            try {
                // Check if exists to avoid duplicates
                const existing = await notion.databases.query({
                    database_id: databaseId,
                    filter: {
                        property: 'Trigger',
                        rich_text: { equals: trigger }
                    }
                })

                if (existing.results.length > 0) {
                    console.log(`   Update existing...`)
                    // For now, just update content to be safe
                    await notion.pages.update({
                        page_id: existing.results[0].id,
                        properties: {
                            'Blog Title': { title: [{ text: { content: title } }] },
                            'Blog Content': { rich_text: [{ text: { content: bodyContent.slice(0, 2000) } }] }, // Limitation on rich_text length
                            'Branch': { select: { name: branch } },
                            'Status': { select: { name: 'Published' } },
                            'CTA': { rich_text: [{ text: { content: 'Reply anytime. — SOR7ED' } }] },
                            'Meta Description': { rich_text: [{ text: { content: meta } }] },
                            'SEO Title': { rich_text: [{ text: { content: title } }] },
                            'Slug': { rich_text: [{ text: { content: slug } }] },
                            'Template': { rich_text: [{ text: { content: bodyContent.slice(0, 2000) } }] }
                        } as any
                    })
                } else {
                    console.log(`   Creating new page...`)
                    await notion.pages.create({
                        parent: { database_id: databaseId },
                        properties: {
                            'Blog Title': { title: [{ text: { content: title } }] },
                            'Blog Content': { rich_text: [{ text: { content: bodyContent.slice(0, 2000) } }] },
                            'Branch': { select: { name: branch } },
                            'Status': { select: { name: 'Published' } },
                            'Trigger': { rich_text: [{ text: { content: trigger } }] },
                            'CTA': { rich_text: [{ text: { content: 'Reply anytime. — SOR7ED' } }] },
                            'Meta Description': { rich_text: [{ text: { content: meta } }] },
                            'SEO Title': { rich_text: [{ text: { content: title } }] },
                            'Slug': { rich_text: [{ text: { content: slug } }] },
                            'Publication Date': { date: { start: new Date().toISOString() } },
                            'Template': { rich_text: [{ text: { content: bodyContent.slice(0, 2000) } }] }
                        } as any
                    })
                }

            } catch (error: any) {
                console.error(`❌ Error syncing ${trigger}:`, error.message)
            }
        }
    }
    console.log('\n✅ Population Complete.')
}

populateBlog()
