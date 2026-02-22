/**
 * Formats raw Markdown-like text from Notion into HTML for browser rendering.
 * Handled: H2, H3, bold, italic, and lists.
 */
export function formatContent(raw: string): string {
    if (!raw) return '';

    return raw
        // Convert ## headings → bold, uppercase H2
        .replace(/^## (.+)$/gm, (_, title) => `<h2><strong>${title.toUpperCase()}</strong></h2>`)
        // Convert ### subheadings → bold, uppercase H3
        .replace(/^### (.+)$/gm, (_, title) => `<h3><strong>${title.toUpperCase()}</strong></h3>`)
        // Convert **bold** → <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* → <em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Convert - list items → <li>
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap groups of <li> in <ul> (Note: this is a simple implementation)
        .replace(/(<li>(?:.|\n)*?<\/li>)/gs, (match) => `<ul>${match}</ul>`)
        // Clean up double <ul> wrap if they were already nested or separated by just newlines
        .replace(/<\/ul>\n*<ul>/g, '\n');
}
