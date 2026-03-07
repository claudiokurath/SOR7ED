import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'
import { useVaultSession } from '../hooks/useVaultSession'
import BranchCard from '../components/BranchCard'
import Testimonials from '../components/Testimonials'
import EmailCapture from '../components/EmailCapture'

export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [showContent, setShowContent] = useState(false)
    const navigate = useNavigate()
    const { isLoggedIn } = useVaultSession()

    // Fetch tools and articles from API routes
    const handleToolClick = (tool: any) => {
        if (isLoggedIn) {
            const url = `https://wa.me/447360277713?text=${encodeURIComponent(tool.whatsappKeyword || tool.name)}`
            window.open(url, '_blank')
        } else {
            navigate('/vault')
        }
    }

    const handlePostClick = (post: any) => {
        navigate(`/blog/${encodeURIComponent(post.title)}`)
    }

    const { data: dynamicTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const { data: dynamicArticles, loading: articlesLoading } = useNotionData<any>('/api/articles')

    const enterAsGuest = () => {
        setShowContent(true)
        setTimeout(() => {
            document.getElementById('vectors')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const faqs = [
        { q: "Is this an app?", a: "No. SOR7ED is a web-based system that connects directly to WhatsApp. No downloads, no updates, no friction." },
        { q: "Is it tailored for ADHD?", a: "Yes. Every tool is built on neuro-architecture principles designed specifically for executive dysfunction, time blindness, and sensory overload." },
        { q: "Does it work outside the UK?", a: "Yes. Our tools are accessible globally via the web. The WhatsApp deployment works on any number with international texting." },
        { q: "Is it really free?", a: "The core interactive Lab tools are free to use on the web. Premium WhatsApp integration and advanced protocols may require credits." },
        { q: "Can I use it with medication?", a: "Absolutely. SOR7ED is a behavioural scaffold that complements medication, therapy, or coaching." }
    ]

    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Full-Screen Background Video */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20 filter grayscale scale-105">
                    <source src="/Intro.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section - Gated Logo & Entry */}
            <section id="hero" className={`relative h-screen flex flex-col justify-center items-center z-20 transition-all duration-1000 ${showContent ? 'h-[40vh] opacity-30 pointer-events-none' : ''}`}>
                <div className="animate-in fade-in zoom-in duration-1000 mb-12">
                    <img src="/logo.png" alt="SOR7ED" className="w-96 md:w-[700px] h-auto object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] opacity-95" />
                </div>

                {!showContent ? (
                    <div className="mt-12 flex flex-col items-center">
                        <button
                            onClick={enterAsGuest}
                            className="bg-sor7ed-yellow text-black font-black uppercase tracking-[0.3em] text-[11px] py-5 px-16 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-500 animate-in fade-in duration-1000 delay-500 fill-mode-both shadow-[0_0_40px_rgba(245,198,20,0.2)]"
                        >
                            Come In
                        </button>
                    </div>
                ) : (
                    <div className="absolute bottom-12 animate-bounce opacity-40">
                        <span className="text-white text-2xl">↓</span>
                    </div>
                )}
            </section>

            {showContent && (
                <main className="relative z-10 animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both">

                    {/* 7 Vectors (Branches) — first thing after hero */}
                    <section id="vectors" className="py-24 flex flex-col items-center">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <div className="text-center mb-16 max-w-2xl mx-auto">
                                <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 uppercase tracking-[0.4em] block mb-4 animate-in slide-in-from-bottom-20">// THE_ARCHITECTURE</span>
                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                                    THE <span className="text-sor7ed-yellow">ARCHITECTURE.</span>
                                </h2>
                                <p className="text-zinc-500 font-light leading-relaxed">
                                    We don't just "fix" ADHD. We build a scaffolding around it. Each vector addresses a core friction point in the neurodivergent experience.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {branches.map(branch => (
                                    <BranchCard key={branch.name} branch={branch} />
                                ))}
                            </div>
                        </div>
                    </section>

                    <Testimonials />

                    {/* Labs (Tools) */}
                    <section id="lab" className="py-40 bg-white/[0.02] border-y border-white/5">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <div className="text-center mb-20">
                                <h2 className="section-title justify-center gap-4 flex mb-6">
                                    <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                                </h2>
                                <p className="text-zinc-500 font-light leading-relaxed max-w-xl mx-auto">
                                    Functional micro-tools designed for immediate relief. From dopamine regulation to impulse filtering.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {toolsLoading ? (
                                    <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs">Accessing Toolkits...</p>
                                ) : dynamicTools.map((tool: any) => (
                                    <div
                                        key={tool.id}
                                        onClick={() => handleToolClick(tool)}
                                        className="stealth-card p-10 group cursor-pointer hover:border-sor7ed-yellow/30 transition-all duration-500"
                                    >
                                        <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all">{tool.emoji || '🛠️'}</div>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-sor7ed-yellow transition-colors">{tool.name}</h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">{tool.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Insights (Articles) */}
                    <section id="blog" className="py-40">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <h2 className="section-title text-center mb-24">
                                <span className="title-white">THE</span> <span className="title-yellow">INSIGHTS.</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articlesLoading ? (
                                    <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs">Syncing Knowledge Base...</p>
                                ) : dynamicArticles.map((post: any, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => handlePostClick(post)}
                                        className="stealth-card group cursor-pointer hover:border-white/20 transition-all duration-700 h-[320px] flex flex-col justify-between p-10"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-widest">{post.branch}</span>
                                                <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-widest">{post.date}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-sor7ed-yellow transition-colors">{post.title}</h3>
                                            <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                                        </div>
                                        <div className="text-right text-zinc-800 group-hover:text-white transition-colors">→</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <EmailCapture />

                    {/* FAQ */}
                    <section id="faq" className="py-40 border-t border-white/5">
                        <div className="container mx-auto max-w-4xl px-6">
                            <h2 className="section-title text-center mb-24">
                                <span className="title-white">SYSTEM</span> <span className="title-yellow">FAQ.</span>
                            </h2>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="stealth-card overflow-hidden">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full text-left p-8 flex justify-between items-center group"
                                        >
                                            <span className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-500 group-hover:text-white'}`}>
                                                {faq.q}
                                            </span>
                                            <span className="text-xl">{activeFaq === i ? '−' : '+'}</span>
                                        </button>
                                        {activeFaq === i && (
                                            <div className="px-8 pb-8 text-zinc-400 text-sm leading-relaxed font-light border-t border-white/5 pt-6 animate-in fade-in duration-500">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <section className="py-60 border-t border-sor7ed-yellow/10 text-center">
                        <div className="container mx-auto px-6">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">
                                STOP STRUGGLING. <br /><span className="text-sor7ed-yellow">START OPERATING.</span>
                            </h2>
                            <a
                                href="https://wa.me/447360277713?text=Hi"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block bg-sor7ed-yellow text-black font-black uppercase tracking-[0.3em] text-xs py-6 px-12 rounded-full hover:scale-110 transition-transform duration-500"
                            >
                                Initialize Connection
                            </a>
                        </div>
                    </section>
                </main>
            )}
        </div>
    )
}
