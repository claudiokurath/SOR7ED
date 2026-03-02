import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNotionData } from '../hooks/useNotionData'
import { formatContent } from '../utils/formatContent'
import FavoriteButton from '../components/FavoriteButton'

interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    cta: string
    coverImage: string
    branch: string
    branchColor: string
    readTime: string
    date: string
    whatsappKeyword: string
}

export default function BlogPost() {
    const { title } = useParams()
    const navigate = useNavigate()
    const { data: articles, loading } = useNotionData<Article>('/api/articles')
    const [article, setArticle] = useState<Article | null>(null)

    useEffect(() => {
        if (articles.length > 0 && title) {
            const decodedTitle = decodeURIComponent(title).trim().toLowerCase()
            const found = articles.find(a =>
                a.title.trim().toLowerCase() === decodedTitle ||
                encodeURIComponent(a.title.trim()) === encodeURIComponent(title)
            )
            if (found) {
                setArticle(found)
            } else if (!loading) {
                console.log("Article not found:", decodedTitle)
            }
        }
    }, [articles, title, loading])

    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <div className="text-zinc-500 font-mono-headline text-xs animate-pulse">Initializing Protocol...</div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center p-6 bg-grid">
                <div className="text-white text-2xl font-black uppercase tracking-[0.15em] mb-8">// PROTOCOL_NOT_FOUND</div>
                <button
                    onClick={() => navigate('/blog')}
                    className="text-[10px] font-mono-headline text-sor7ed-yellow hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                    Return to Repository
                </button>
            </div>
        )
    }

    return (
        <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto">
            {/* Premium Background Overlay */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Back Link */}
                    <button
                        onClick={() => navigate('/blog')}
                        className="mb-12 text-zinc-600 hover:text-sor7ed-yellow transition-colors text-[10px] font-mono-headline uppercase tracking-[0.4em] flex items-center gap-4 animate-in slide-in-from-left-20"
                    >
                        <span>←</span> <span>Back to Index</span>
                    </button>

                    <article className="animate-in fade-in duration-1000">
                        {/* Header */}
                        <div className="mb-16">
                            <div className="flex items-center justify-between gap-6 mb-8 text-[10px] font-mono-headline uppercase tracking-[0.4em]">
                                <div className="flex items-center gap-6">
                                    <span className="text-sor7ed-yellow">// {article.branch}</span>
                                    <span className="text-zinc-600">{article.readTime}</span>
                                    <span className="text-zinc-600">{article.date}</span>
                                </div>
                                <FavoriteButton itemId={article.id} itemType="blog" />
                            </div>
                        </div>

                        {/* Cover Image */}
                        {article.coverImage && (
                            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-20 border border-white/5 shadow-2xl relative group">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        )}

                        {/* Article Header (Inside content area as requested) */}
                        <div className="mb-20">
                            <h1 className="text-6xl md:text-8xl lg:font-league-gothic text-white ">
                                {article.title}
                            </h1>
                        </div>

                        {/* Content Area */}
                        <div className="stealth-card p-10 md:p-20 mb-20">
                            <div
                                className="blog-content text-zinc-400 font-light leading-relaxed text-lg space-y-8"
                                dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                            />

                            {/* Ending logic */}
                            <div className="mt-24 pt-12 border-t border-white/5 text-center">
                                <span className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-[0.5em] italic">
                                    [End of Post]
                                </span>
                            </div>
                        </div>

                        {/* CTA Section - Re-styled as Requested */}
                        <div className="stealth-card p-12 md:p-16 text-center relative border-sor7ed-yellow/20 bg-gradient-to-br from-sor7ed-yellow/5 to-transparent mb-20">
                            <div className="space-y-8">
                                <div className="h-px w-24 bg-sor7ed-yellow/30 mx-auto"></div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-[0.15em]">Ready to hand this off?</h3>
                                <p className="text-zinc-500 font-light leading-relaxed max-w-lg mx-auto">
                                    Initialize the operational protocol on your primary device. No friction. Just help.
                                </p>
                                <a
                                    href={`https://wa.me/447360277713?text=${encodeURIComponent(article.whatsappKeyword || article.title)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary"
                                >
                                    Initialize Protocol
                                </a>
                                <div className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">
                                    // Deployment via WhatsApp Secure Node
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    )
}
