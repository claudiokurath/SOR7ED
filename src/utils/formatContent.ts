/**
 * Formats raw Markdown-like text from Notion into HTML for browser rendering.
 * Handled: H2, H3, bold, italic, and lists.
 */
export function formatContent(raw: string): string {
    if (!raw) return '';

    let html = raw
        // Handle Images: ![alt](url)
        .replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, url) => {
            return `<div class="my-12 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
                <img src="${url}" alt="${alt}" class="w-full h-auto opacity-90 transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>`;
        })
        // Convert # headings to H2 (to avoid double H1)
        .replace(/^# (.+)$/gm, (_, title) => `<h2>${title.toUpperCase()}</h2>`)
        // Convert ## headings → bold, uppercase H2
        .replace(/^## (.+)$/gm, (_, title) => `<h2>${title.toUpperCase()}</h2>`)
        // Convert ### subheadings → bold, uppercase H3
        .replace(/^### (.+)$/gm, (_, title) => `<h3>${title.toUpperCase()}</h3>`)
        // Convert > blockquotes → TL;DR style
        .replace(/^> (.+)$/gm, (_, text) => `
            <blockquote class="border-l-4 border-sor7ed-yellow bg-sor7ed-yellow/5 p-10 my-16 rounded-r-3xl italic text-white/90 font-medium relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-[0.03] font-black text-8xl tracking-[0.15em] select-none pointer-events-none">TL;DR</div>
                <span class="relative z-10 block">TL;DR: ${text}</span>
            </blockquote>
        `)
        // Convert **bold** → <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* → <em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Convert - list items → <li>
        .replace(/^- (.+)$/gm, '<li>$1</li>');

    // Wrap groups of <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (match) => `<ul class="space-y-4 my-10">${match}</ul>`);

    return html;
}
