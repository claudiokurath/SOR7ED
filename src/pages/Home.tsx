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
        { q: "Is it really free?", a: "Yes. Completely free. No paywalls, no hidden fees, no credit limits. Everything is fully accessible right now." },
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
            <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center z-20 px-4 md:px-6 text-center snap-start">
                <div className="animate-in fade-in zoom-in duration-1000 mb-6 md:mb-12">
                    <img src="/logo.png" alt="SOR7ED" className="w-64 md:w-[640px] h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.08)] opacity-95" />
                </div>

                <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in slide-in-from-bottom-20 duration-1000 delay-300 fill-mode-both">
                    <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-normal tracking-[0.16em] leading-[0.85] text-white mb-6 uppercase">
                        <span className="text-sor7ed-yellow">SOR7ED</span> IS A SHAME-FREE PLATFORM BUILT FOR NEURODIVERGENT AND BUSY MINDS
                    </h1>

                    <div className="text-zinc-400 text-sm md:text-lg font-light leading-relaxed max-w-3xl mx-auto space-y-4 md:space-y-6 text-left md:text-center">
                        <p>
                            — people with ADHD, autism, dyslexia, RSD, and related experiences who are tired of productivity advice that doesn't work for them.
                        </p>
                        <p>
                            We publish practical articles three times a week and deliver <strong className="text-white font-medium">free templates via WhatsApp</strong> — no new apps, no downloads, just the app you already use.
                        </p>
                        <p>
                            <strong className="text-white font-medium">We're not therapy, medicine, or a crisis service.</strong> We're a content platform that gives you templates, scripts, and tools to handle the life admin that feels impossible.
                        </p>
                        <p>
                            SOR7ED was built by neurodivergent people who got tired of advice that never worked for their brains — so built something that does.
                        </p>
                        <p className="text-sor7ed-yellow font-fuel-decay uppercase tracking-[0.1em] text-xl md:text-3xl pt-2 text-center text-shadow-glow">
                            TEMPLATES ARE FREE. FOREVER.
                        </p>
                    </div>


                </div>
            </section>

            <div className="relative z-10">
                {/* About Section Removed (Moved to Hero) */}

                {/* 7 Vectors (Branches) - Combined with Why Different */}
                <section id="vectors" className="relative min-h-screen w-full z-[21] px-4 md:px-6 border-t border-white/5 py-48 bg-black snap-start scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-10 md:mb-10 max-w-3xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 md:mb-5 animate-in slide-in-from-bottom-20">// THE_ARCHITECTURE</span>
                            <h2 className="text-4xl md:text-8xl font-normal tracking-[0.16em] leading-[0.95] mb-6 md:mb-4 text-white">
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


                    </div>
                </section>

                {/* Labs (Tools) */}
                <section id="lab" className="relative min-h-screen w-full z-[22] px-4 md:px-6 py-48 bg-black border-y border-white/5 snap-start scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-10 md:mb-10 max-w-3xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 md:mb-5 animate-in slide-in-from-bottom-20">// THE_LAB</span>
                            <h2 className="text-4xl md:text-8xl font-normal tracking-[0.16em] leading-[0.95] mb-6 md:mb-4 text-white">
                                THE <span className="text-sor7ed-yellow">TOOLS.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed text-sm md:text-sm">
                                Functional micro-tools designed for immediate relief. From dopamine regulation to impulse filtering.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
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
                        <div className="text-center mb-10 md:mb-10 max-w-3xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 md:mb-5 animate-in slide-in-from-bottom-20">// THE_BLOG</span>
                            <h2 className="text-4xl md:text-8xl font-normal tracking-[0.16em] leading-[0.95] mb-6 md:mb-12 text-white">
                                THE <span className="text-sor7ed-yellow">BLOG.</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
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
                        <div className="text-center mb-10 md:mb-10 max-w-3xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 md:mb-5 animate-in slide-in-from-bottom-20">// THE_FAQ</span>
                            <h2 className="text-4xl md:text-8xl font-normal tracking-[0.16em] leading-[0.95] mb-6 md:mb-12 text-white">
                                SYSTEM <span className="text-sor7ed-yellow">FAQ.</span>
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className={`stealth-card overflow-hidden transition-all duration-300 ${activeFaq === i ? 'border-sor7ed-yellow shadow-[0_0_30px_rgba(245,198,20,0.1)]' : 'border-white/5'}`}>
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full text-left p-6 md:p-10 flex justify-between items-center group"
                                    >
                                        <span className={`text-sm md:text-base font-fuel-decay uppercase tracking-[0.15em] transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-400 group-hover:text-white'}`}>
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
                        <h2 className="text-4xl md:text-8xl font-normal tracking-[0.16em] leading-[0.95] mb-12 md:mb-16 text-center text-white">
                            STOP STRUGGLING. <br /><span className="text-sor7ed-yellow">START OPERATING.</span>
                        </h2>
                        <div className="flex flex-col items-center space-y-8">
                            <button
                                onClick={() => {
                                    // If we had isLoggedIn from VaultContext here, we could redirect to /vault
                                    // But since Home doesn't import useVault currently, we'll keep the design
                                    // where it opens AuthModal (which hides signup if logged in, or the Header handles it)
                                    onOpenAuth('signup')
                                }}
                                className="inline-block bg-sor7ed-yellow text-black font-fuel-decay font-normal uppercase tracking-[0.3em] text-[10px] md:text-xs py-6 md:py-8 px-16 md:px-24 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(245,198,20,0.3)]"
                            >
                                Initialize Connection
                            </button>
                            <button
                                onClick={() => onOpenAuth('signin')}
                                className="text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
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

