const fs = require('fs');
const path = require('path');

const files = [
    'scripts/check_blog_content.cjs',
    'scripts/check_blog_props.cjs',
    'scripts/check_new_tools_content.cjs',
    'scripts/check_tools.cjs',
    'scripts/compare_counts.cjs',
    'scripts/debug_props.cjs',
    'scripts/final_cta_fill_v2.cjs',
    'scripts/final_verification.cjs',
    'scripts/list_old_titles.cjs',
    'scripts/migrate_content.cjs',
    'scripts/migrate_content_fuzzy.cjs',
    'scripts/populate_blog_cta.cjs',
    'scripts/populate_cta_links.cjs',
    'scripts/update_blog_schema.cjs',
    'scripts/verify_cta_final.cjs',
    'scripts/advanced_cta_update.cjs'
];

files.forEach(file => {
    try {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${file}`);
        }
    } catch (e) { console.log(`Error deleting ${file}: ${e.message}`); }
});
console.log('Cleanup complete.');
