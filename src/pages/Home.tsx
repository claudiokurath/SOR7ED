import { useState } from 'react'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'
import BranchCard from '../components/BranchCard'
import ToolCard from '../components/ToolCard'
import BlogCard from '../components/BlogCard'

interface HomeProps {
    onOpenAuth: (mode?: 'signup' | 'signin') => void
}

export default function Home({ onOpenAuth }: HomeProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)

    // Fetch tools and articles from API routes
    const { data: dynamicTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const { data: dynamicArticles, loading: articlesLoading } = useNotionData<any>('/api/articles')
    const faqs = [
        { q: "Is this an app?", a: "No. SOR7ED is a web-based system that connects directly to WhatsApp. No downloads, no updates, no friction." },
        { q: "Is it tailored for ADHD?", a: "Yes. Every tool is built on neuro-architecture principles designed specifically for executive dysfunction, time blindness, and sensory overload." },
        { q: "Does it work outside the UK?", a: "Yes. Our tools are accessible globally via the web. The WhatsApp deployment works on any number with international texting." },
        { q: "Is it really free?", a: "The core interactive Lab tools are free to use on the web. Premium WhatsApp integration and advanced protocols may require credits." },
        { q: "Can I use it with medication?", a: "Absolutely. SOR7ED is a behavioural scaffold that complements medication, therapy, or coaching." }
    ]



    return (
        <div className="bg-black text-white font-roboto w-full relative">
            {/* Background elements (Fixed) */}
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center z-20 px-4 md:px-6 text-center snap-start">
                <div className="animate-in fade-in zoom-in duration-1000 mb-6 md:mb-12">
                    <img src="/logo.png" alt="SOR7ED" className="w-64 md:w-[640px] h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.08)] opacity-95" />
                </div>

                <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in slide-in-from-bottom-20 duration-1000 delay-300 fill-mode-both">
                    <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-bold tracking-[0.15em] leading-[0.85] text-white mb-6">
                        ADHD-FRIENDLY TOOLS — <br />
                        <span className="text-sor7ed-yellow">DELIVERED TO YOUR PHONE.</span>
                    </h1>

                    <p className="text-zinc-500 text-sm md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Quick interactive tools for executive function, time blindness, and sensory overwhelm.
                        No complex apps. Just the support you need, exactly when you need it.
                    </p>

                    {/* Integrated 3 Steps - Compact */}
                    <div className="max-w-4xl mx-auto w-full pt-12 md:pt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <div className="stealth-card p-5 md:p-6 space-y-3 bg-white/[0.03] border-white/5 backdrop-blur-md">
                                <div className="text-sor7ed-yellow text-[8px] font-mono-headline uppercase tracking-[0.15em]">// STEP_01</div>
                                <h3 className="text-base md:text-lg font-league-gothic uppercase text-white ">Daily Micro-Tools</h3>
                                <p className="text-zinc-500 text-[10px] md:text-xs font-light leading-relaxed">
                                    Functional support for executive function and neural regulation.
                                </p>
                            </div>
                            <div className="stealth-card p-5 md:p-6 space-y-3 bg-white/[0.03] border-white/5 backdrop-blur-md">
                                <div className="text-sor7ed-yellow text-[8px] font-mono-headline uppercase tracking-[0.15em]">// STEP_02</div>
                                <h3 className="text-base md:text-lg font-league-gothic uppercase text-white ">No Apps. Just WhatsApp.</h3>
                                <p className="text-zinc-500 text-[10px] md:text-xs font-light leading-relaxed">
                                    Respond directly to helpful prompts. No complex dashboards.
                                </p>
                            </div>
                            <div className="stealth-card p-5 md:p-6 space-y-3 bg-white/[0.03] border-white/5 backdrop-blur-md">
                                <div className="text-sor7ed-yellow text-[8px] font-mono-headline uppercase tracking-[0.15em]">// STEP_03</div>
                                <h3 className="text-base md:text-lg font-league-gothic uppercase text-white ">Neural Scaffolding</h3>
                                <p className="text-zinc-500 text-[10px] md:text-xs font-light leading-relaxed">
                                    Designed to bypass friction and keep you operating at peak capacity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-10">
                {/* 7 Vectors (Branches) - Combined with Why Different */}
                <section id="vectors" className="relative min-h-screen w-full z-[21] px-4 md:px-6 border-t border-white/5 py-48 bg-black snap-start scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-10 md:mb-10 max-w-3xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 md:mb-5 animate-in slide-in-from-bottom-20">// THE_ARCHITECTURE</span>
                            <h2 className="text-4xl md:text-8xl font-bold tracking-[0.1em] leading-[0.95] mb-6 md:mb-4 text-white">
                                THE <span className="text-sor7ed-yellow">ARCHITECTURE.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed text-sm md:text-sm">
                                We build a behavioural scaffold. Each vector addresses a core friction point in the neurodivergent experience.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 mb-16 md:mb-12 text-left">
                            {branches.map((branch, i) => {
                                // Better distribution for 7 items
                                let span = 'md:col-span-3' // Default for 4-in-a-row (Mind, Wealth, Body, Tech)
                                if (i >= 4) span = 'md:col-span-4' // Last row of 3 (Connection, Impression, Growth)

                                return (
                                    <div key={branch.name} className={`${span}`}>
                                        <BranchCard branch={branch} />
                                    </div>
                                )
                            })}
                        </div>

                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 border-t border-white/5 pt-16 mt-16">
                            <div className="space-y-4">
                                <h4 className="text-zinc-600 font-league-gothic uppercase text-xl tracking-[0.1em] flex items-center gap-3">
                                    <span className="text-red-500/30">🗙</span> Traditional Apps
                                </h4>
                                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                                    Setup required. Daily manual entry. High friction. Often forgotten in 48 hours.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sor7ed-yellow font-league-gothic uppercase text-xl tracking-[0.1em] flex items-center gap-3">
                                    <span className="text-sor7ed-yellow">✔</span> The SOR7ED System
                                </h4>
                                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                                    Zero-friction. Responds directly to you via WhatsApp. Tools find you exactly when needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Labs (Tools) */}
                <section id="lab" className="relative min-h-screen w-full z-[22] px-4 md:px-6 py-48 bg-black border-y border-white/5 snap-start scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="section-title justify-center gap-4 flex mb-6">
                                <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed max-w-xl mx-auto text-base">
                                Functional micro-tools designed for immediate relief. From dopamine regulation to impulse filtering.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {toolsLoading ? (
                                <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs py-20">Accessing Toolkits...</p>
                            ) : dynamicTools.slice(0, 6).map((tool: any) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Insights (Articles) */}
                <section id="blog" className="relative min-h-screen w-full z-[23] px-4 md:px-6 py-48 bg-black snap-start scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="section-title text-center mb-16 md:mb-24">
                            <span className="title-white">THE</span> <span className="title-yellow">INSIGHTS.</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {articlesLoading ? (
                                <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs py-20">Syncing Knowledge Base...</p>
                            ) : dynamicArticles.slice(0, 6).map((post: any) => (
                                <BlogCard key={post.id} article={post} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="relative min-h-screen w-full z-[24] px-4 md:px-6 border-t border-white/5 bg-black snap-start py-48 scroll-mt-24">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="section-title text-center mb-12 md:mb-16">
                            <span className="title-white">SYSTEM</span> <span className="title-yellow">FAQ.</span>
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className={`stealth-card overflow-hidden transition-all duration-300 ${activeFaq === i ? 'border-sor7ed-yellow shadow-[0_0_30px_rgba(245,198,20,0.1)]' : 'border-white/5'}`}>
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full text-left p-6 md:p-10 flex justify-between items-center group"
                                    >
                                        <span className={`text-sm md:text-base font-league-gothic uppercase tracking-[0.15em] transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-400 group-hover:text-white'}`}>
                                            {faq.q}
                                        </span>
                                        <span className={`text-xl transition-transform ${activeFaq === i ? 'rotate-45 text-sor7ed-yellow' : 'text-zinc-500'}`}>+</span>
                                    </button>
                                    {activeFaq === i && (
                                        <div className="px-6 md:px-10 pb-6 md:pb-8 text-zinc-400 text-xs md:text-sm leading-relaxed font-light border-t border-white/5 pt-6 animate-in fade-in duration-500">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="relative min-h-screen w-full z-[25] px-4 md:px-6 border-t border-sor7ed-yellow/10 bg-black snap-start py-48 scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="text-4xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-12 md:mb-16">
                            STOP STRUGGLING. <br /><span className="text-sor7ed-yellow">START OPERATING.</span>
                        </h2>
                        <div className="flex flex-col items-center space-y-8">
                            <button
                                onClick={() => onOpenAuth('signup')}
                                className="inline-block bg-sor7ed-yellow text-black font-league-gothic font-normal uppercase tracking-[0.3em] text-[10px] md:text-xs py-6 md:py-8 px-16 md:px-24 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(245,198,20,0.3)]"
                            >
                                Initialize Connection
                            </button>
                            <button
                                onClick={() => onOpenAuth('signin')}
                                className="text-[10px] font-league-gothic uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                            >
                                Already a member? Sign in
                            </button>
                        </div>

                        <div className="mt-32 pt-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-16 text-zinc-600 font-mono-headline text-[10px] uppercase tracking-[0.4em]">
                            <div className="space-y-6">
                                <p>// DIRECT_LINE</p>
                                <a href="tel:+447360277713" className="text-zinc-400 hover:text-sor7ed-yellow transition-colors text-xs">+44 7360 277713</a>
                            </div>
                            <div className="space-y-6">
                                <p>// SECURE_CHANNEL</p>
                                <a href="mailto:hello@sor7ed.com" className="text-zinc-400 hover:text-sor7ed-yellow transition-colors text-xs">HELLO@SOR7ED.COM</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

