const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

const postsToCreate = [
    { title: 'The Reset Ritual: Recovering from Overwhelm', branch: 'Mind', keyword: 'FOCUS' },
    { title: 'Body Doubling: Why It Works', branch: 'Tech', keyword: 'TECH' },
    { title: 'The ADHD Tax Audit: Where Your Money Goes', branch: 'Wealth', keyword: 'GROWTH' },
    { title: 'Sensory Overload Recovery Plan', branch: 'Body', keyword: 'ENERGY' },
    { title: 'Friendship Ghosting: The Shame Cycle', branch: 'Connection', keyword: 'CONSENT' },
    { title: 'Masking Relapse: The Cost of Passing', branch: 'Impression', keyword: 'IMPRESSION' },
    { title: 'Digital Hygiene: Cleaning Your Feed', branch: 'Tech', keyword: 'TECH' },
    { title: 'The Dopamine Menu: Quick Wins for Low Energy', branch: 'Body', keyword: 'ENERGY' },
    { title: 'Rejection Sensitivity (RSD) Survival Guide', branch: 'Mind', keyword: 'FOCUS' },
    { title: 'The Energy Equation: Budgeting Your Spoons', branch: 'Body', keyword: 'ENERGY' },
    { title: 'Automation for ADHD: Tools That Help', branch: 'Tech', keyword: 'TECH' },
    { title: 'The Boundary Script: Saying No Without Guilt', branch: 'Connection', keyword: 'CONSENT' }
];

async function seedBlog() {
  console.log('🌱 Seeding 12 Fresh Blog Posts...');
  
  for (const p of postsToCreate) {
      console.log(`Creating: ${p.title}`);
      
      const intro = `# ${p.title}\n\nA comprehensive guide to managing ${p.title.toLowerCase()} with neurodivergent-friendly strategies.\n\n## Why This Matters\nUnderstanding the mechanics of ${p.branch} is crucial for sustainable growth. This protocol breaks down the 'why' and gives you the 'how'.\n\n## The Protocol\n1. Acknowledge the state.\n2. Apply the micro-step.\n3. celebrate the win.`;
      
      const excerpt = intro.substring(0, 150) + '...';
      const ctaText = `Struggling with ${p.title.split(':')[0]}? Text `;
      const ctaLinkText = p.keyword;
      const ctaLinkUrl = `https://wa.me/447360277713?text=${p.keyword}`;
      const ctaSuffix = ` to get the guide.`;

      try {
        await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                parent: { database_id: BLOG_ID },
                properties: {
                    'Title': { title: [{ text: { content: p.title } }] },
                    'Branch': { select: { name: p.branch } },
                    'Status': { select: { name: 'Published' } },
                    'Content': { rich_text: [{ text: { content: intro } }] },
                    'Excerpt': { rich_text: [{ text: { content: excerpt } }] },
                    'Link': { url: ctaLinkUrl }, // Just in case
                    'CTA': { 
                        rich_text: [
                            { text: { content: ctaText } },
                            { text: { content: ctaLinkText, link: { url: ctaLinkUrl } }, annotations: { bold: true } },
                            { text: { content: ctaSuffix } }
                        ]
                    },
                    'Publish Date': { date: { start: new Date().toISOString() } }
                }
            })
        });
      } catch (e) { console.log(`Error: ${e.message}`); }
  }
  console.log('✅ SEEDING COMPLETE! 12 Posts Live.');
}

seedBlog();

