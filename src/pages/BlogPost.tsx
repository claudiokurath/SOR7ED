import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNotionData } from '../hooks/useNotionData'
import { formatContent } from '../utils/formatContent'

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-zinc-500 animate-pulse">Loading Protocol...</div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
                <div className="text-white text-2xl mb-4">Protocol Not Found</div>
                <button onClick={() => navigate('/blog')} className="text-sor7ed-yellow hover:underline">
                    Return to Insights
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* Back Link */}
                <button
                    onClick={() => navigate('/blog')}
                    className="mb-8 text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
                >
                    ← Back to Index
                </button>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs font-mono-headline px-3 py-1 rounded bg-white/5 text-sor7ed-yellow uppercase tracking-wider">
                            {article.branch}
                        </span>
                        <span className="text-xs font-mono-headline text-zinc-600 uppercase tracking-wider">
                            {article.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight uppercase tracking-tight">
                        {article.title}
                    </h1>
                </div>

                {/* Cover Image */}
                {article.coverImage && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none mb-16">
                    <div
                        className="blog-content text-zinc-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                    />
                </div>

                {/* CTA Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-sor7ed-yellow/50"></div>

                    {localStorage.getItem('sor7ed_guest') === 'true' ? (
                        <>
                            <h3 className="text-2xl font-bold mb-4 text-white">Action Required</h3>
                            <p className="text-zinc-400 mb-8 max-w-lg mx-auto uppercase tracking-widest text-[10px]">
                                This is an operational protocol. To deploy this logic to your device and initialize the AI-assisted flow, you must be a member.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <span>Sign Up to Deploy</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mb-4 text-white">Ready to deploy this system?</h3>
                            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                                {article.cta || "Get this protocol sent directly to your WhatsApp for instant access when you need it most."}
                            </p>
                            <a
                                href={`https://wa.me/447360277713?text=${article.whatsappKeyword || 'Hi'}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <span>Initialize Protocol</span>
                                <span className="text-xs opacity-70">via WhatsApp</span>
                            </a>
                        </>
                    )}
                </div>


            </div>
        </div>
    )
}
