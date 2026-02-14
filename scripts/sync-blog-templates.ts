import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
const databaseId = process.env.NOTION_BLOG_DATABASE_ID

async function syncBlogTemplates() {
    console.log('🚀 Starting Blog Template Sync...')

    if (!databaseId) {
        console.error('❌ NOTION_BLOG_DATABASE_ID missing')
        return
    }

    const files = [
        'TEMPLATES_FINAL_BATCH.md',
        'AGENCYPLAN_TEMPLATE.md',
        'CONSENT_TEMPLATE.md'
    ]

    for (const file of files) {
        const filePath = path.join(process.cwd(), file)
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${file}`)
            continue
        }

        console.log(`\n📄 Parsing ${file}...`)
        const content = fs.readFileSync(filePath, 'utf-8')

        // Support both # TRIGGER: and ## TRIGGER:
        const sections = content.split(/(?=^#+ TRIGGER:)/m)

        for (const section of sections) {
            if (!section.trim()) continue

            const triggerMatch = section.match(/#+ TRIGGER:\s*(.*)/)
            if (!triggerMatch) continue

            const triggerRaw = triggerMatch[1].trim()
            // Support multiple triggers separated by / or ,
            const triggers = triggerRaw.split(/[\/,]/).map(t => t.trim())

            const postMatch = section.match(/\*\*POST:\*\* (.*)/)
            const postTitle = postMatch ? postMatch[1].trim() : ''

            // Extract the block inside ``` 
            const templateMatch = section.match(/```([\s\S]*?)```/)
            const templateContent = templateMatch ? templateMatch[1].trim() : ''

            if (!triggers[0] || !templateContent) continue

            console.log(`✨ Found triggers: ${triggers.join(', ')} for post: ${postTitle}`)

            for (const trigger of triggers) {
                try {
                    // Search if exists
                    const existing = await notion.databases.query({
                        database_id: databaseId,
                        filter: {
                            property: 'Trigger',
                            rich_text: { equals: trigger }
                        }
                    })

                    if (existing.results.length > 0) {
                        console.log(`   Updating existing post [${trigger}]...`)
                        await notion.pages.update({
                            page_id: existing.results[0].id,
                            properties: {
                                'Template': { rich_text: [{ text: { content: templateContent } }] }
                            } as any
                        })
                    } else {
                        // Try finding by Title if Trigger property search failed or returned nothing
                        console.log(`   No post with trigger [${trigger}]. Searching by title [${postTitle}]...`)
                        const byTitle = await notion.databases.query({
                            database_id: databaseId,
                            filter: {
                                property: 'Title',
                                title: { equals: postTitle }
                            }
                        })

                        if (byTitle.results.length > 0) {
                            console.log(`   Updating post found by title [${postTitle}] with trigger [${trigger}]...`)
                            await notion.pages.update({
                                page_id: byTitle.results[0].id,
                                properties: {
                                    'Trigger': { rich_text: [{ text: { content: trigger } }] },
                                    'Template': { rich_text: [{ text: { content: templateContent } }] }
                                } as any
                            })
                        } else {
                            console.warn(`   ❌ Could not find post for trigger [${trigger}] or title [${postTitle}]`)
                        }
                    }
                } catch (err: any) {
                    console.error(`❌ Error syncing ${trigger}:`, err.message)
                }
            }
        }
    }

    console.log('\n✅ Sync Complete.')
}

syncBlogTemplates()
