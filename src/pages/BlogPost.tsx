import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post?slug=${encodeURIComponent(slug || '')}`)
                const data = await res.json()
                setPost(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-sor7ed-yellow font-mono-headline animate-pulse uppercase tracking-[0.5em]">Initializing Reader...</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="section-title"><span className="title-white">POST</span> <span className="title-yellow">NOT FOUND.</span></h1>
                <Link to="/" className="btn-primary mt-8">Return Home</Link>
            </div>
        )
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-sor7ed-yellow selection:text-black">
            {/* Navigation Header */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 bg-gradient-to-b from-black to-transparent">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-zinc-500 hover:text-white font-mono-headline text-[10px] tracking-[0.3em] uppercase flex items-center space-x-2 transition-colors">
                        <span>&larr; [ BACK ]</span>
                    </Link>
                </div>
            </div>

            {/* Hero Image */}
            {post.image && (
                <div className="w-full h-[60vh] relative overflow-hidden border-b border-sor7ed-yellow/20">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>
            )}

            <article className="container mx-auto max-w-3xl px-6 py-24 relative z-10">
                <header className="text-center mb-24">
                    <div className="text-[10px] font-mono-headline text-sor7ed-yellow mb-8 tracking-[0.4em] uppercase">
                        Analysis // {post.date} // {post.category}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-12">
                        {post.title}
                    </h1>

                    <div className="w-24 h-px bg-sor7ed-yellow mx-auto" />
                </header>

                <div className="prose prose-invert prose-zinc max-w-none">
                    {post.blocks?.map((block: any, i: number) => {
                        const type = block.type
                        const content = block[type]?.rich_text?.[0]?.plain_text

                        if (!content) return null

                        switch (type) {
                            case 'paragraph':
                                return <p key={i} className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed mb-10 tracking-wide">{content}</p>
                            case 'heading_1':
                                return <h2 key={i} className="text-3xl font-black text-white uppercase tracking-tight mt-16 mb-8">{content}</h2>
                            case 'heading_2':
                                return <h3 key={i} className="text-2xl font-black text-white uppercase tracking-tight mt-12 mb-6">{content}</h3>
                            case 'heading_3':
                                return <h4 key={i} className="text-xl font-black text-white uppercase tracking-tight mt-10 mb-4">{content}</h4>
                            case 'bulleted_list_item':
                                return <li key={i} className="text-zinc-400 text-lg mb-4 list-none border-l-2 border-sor7ed-yellow pl-6">{content}</li>
                            default:
                                return <p key={i} className="text-zinc-500 italic mb-8">{content}</p>
                        }
                    })}
                </div>

                {/* Final Footer CTA */}
                <footer className="mt-32 pt-20 border-t border-zinc-900 text-center">
                    <div className="text-[10px] font-mono-headline text-zinc-600 mb-8 tracking-widest uppercase">Operational Request</div>
                    <a href={`https://wa.me/447360277713?text=PROTOCOL: ${post.title}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Initialize Interactive Protocol
                    </a>
                </footer>
            </article>
        </div>
    )
}
