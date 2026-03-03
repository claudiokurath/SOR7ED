/**
 * Formats raw Markdown-like text from Notion into HTML for browser rendering.
 * Handled: H2, H3, bold, italic, and lists.
 */
export function formatContent(raw: string): string {
    if (!raw) return '';

    // Normalize newlines
    let text = raw.replace(/\r\n/g, '\n');

    let html = text
        // Handle Images: ![alt](url)
        .replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, url) => {
            return `<div class="my-12 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
                <img src="${url}" alt="${alt}" class="w-full h-auto opacity-90 transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>`;
        })
        // Convert # headings to H2 (to avoid double H1)
        .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>')
        // Convert ## headings → bold, uppercase H2
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        // Convert ### subheadings → bold, uppercase H3
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        // Convert ALL CAPS lines to H2 automatically
        .replace(/^([^a-z\n]*[A-Z][^a-z\n]*)$/gm, (match) => {
            const trimmed = match.trim();
            // Ignore purely symbolic lines (e.g. "----"), only if we actually have text
            if (trimmed.length > 5 && /[A-Z]/.test(trimmed)) {
                return `<h2>${trimmed}</h2>`;
            }
            return match;
        })
        // Convert > blockquotes → TL;DR style
        .replace(/^>\s+(.+)$/gm, (_, t) => `
            <blockquote class="border-l-4 border-sor7ed-yellow bg-sor7ed-yellow/5 p-10 my-16 rounded-r-3xl italic text-white/90 font-medium relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-[0.03] font-black text-8xl tracking-[0.15em] select-none pointer-events-none">TL;DR</div>
                <span class="relative z-10 block">TL;DR: ${t}</span>
            </blockquote>
        `)
        // Convert **bold** → <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* → <em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Convert - list items → <li>
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>');

    // Wrap groups of <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (match) => `<ul class="space-y-4 my-10">${match}</ul>`);

    // Ensure block elements have breathing room so they can be parsed
    html = html.replace(/<h2/g, '\n\n<h2').replace(/<\/h2>/g, '</h2>\n\n');
    html = html.replace(/<h3/g, '\n\n<h3').replace(/<\/h3>/g, '</h3>\n\n');
    html = html.replace(/<ul/g, '\n\n<ul').replace(/<\/ul>/g, '</ul>\n\n');
    html = html.replace(/<div/g, '\n\n<div').replace(/<\/div>/g, '</div>\n\n');
    html = html.replace(/<blockquote/g, '\n\n<blockquote').replace(/<\/blockquote>/g, '</blockquote>\n\n');

    // Convert double newlines to paragraphs and single newlines to <br>
    html = html.split(/\n{2,}/).map(block => {
        block = block.trim();
        if (!block) return '';
        // If it's a block-level HTML tag, return it exactly as is
        if (block.match(/^(<h|<div|<ul|<blockquote)/)) {
            return block;
        }
        // Otherwise wrap in <p> tag
        return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    }).join('\n\n');

    return html;
}
