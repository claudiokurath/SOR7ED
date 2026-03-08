import { useState } from 'react'
import { sections } from '../data/sections'
import SectionCard from '../components/SectionCard'

interface HomeProps {
    onOpenAuth: (mode?: 'signup' | 'signin') => void
}

export default function Home({ onOpenAuth }: HomeProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)

    const faqs = [
        { q: "Is this an app?", a: "No. SOR7ED is a web-based system that connects directly to WhatsApp. No downloads, no updates, no friction." },
        { q: "Is it tailored for ADHD?", a: "Yes. Every tool is built on neuro-architecture principles designed specifically for executive dysfunction, time blindness, and sensory overload." },
        { q: "Does it work outside the UK?", a: "Yes. Our tools are accessible globally via the web. The WhatsApp deployment works on any number with international texting." },
        { q: "Is it really free?", a: "Yes. Completely free. No paywalls, no hidden fees, no credit limits. Everything is fully accessible right now." },
        { q: "Can I use it with medication?", a: "Absolutely. SOR7ED is a behavioural scaffold that complements medication, therapy, or coaching." }
    ]

    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Full-Screen Background Image */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <img
                    src="/hero-background.jpg"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-80 scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-[#050505]" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="relative h-screen flex flex-col justify-center items-center z-20 transition-all duration-1000">
                <div className="animate-in fade-in zoom-in duration-1000 mb-12 text-center px-6">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-6">SOR7ED <span className="text-sor7ed-yellow">LAB.</span></h1>
                    <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-2xl mx-auto">
                        Your behavioral scaffold. Designed for immediate relief, from dopamine regulation to impulse filtering.
                    </p>
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center gap-6 justify-center">
                    <button
                        onClick={() => onOpenAuth('signin')}
                        className="bg-sor7ed-yellow text-black font-black uppercase tracking-[0.3em] text-[11px] py-5 px-16 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-500 animate-in fade-in duration-1000 delay-500 fill-mode-both shadow-[0_0_40px_rgba(245,198,20,0.2)]"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => document.getElementById('vectors')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.3em] text-[11px] py-5 px-16 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-500 animate-in fade-in duration-1000 delay-500 fill-mode-both"
                    >
                        Continue as a Guest
                    </button>
                </div>
            </section>

            <main className="relative z-10 animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both">
                {/* 7 Vectors (Branches) — first thing after hero */}
                <section id="vectors" className="py-12 md:py-24 flex flex-col items-center min-h-[90vh] justify-center scroll-mt-24">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-12 max-w-4xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 animate-in slide-in-from-bottom-20">// THE_ARCHITECTURE</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                                THE <span className="text-sor7ed-yellow">ARCHITECTURE.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed mb-4">
                                SOR7ED is your comprehensive life management system. We've broken down every aspect of living into 7 core vectors to help you build a solid scaffolding.
                            </p>
                            <p className="text-zinc-500 font-light leading-relaxed">
                                Your mission is simple: Pick an area where you need clarity, dive into the tools, and start optimizing. Whether you need immediate action or long-term planning, we've got you sorted. Select a section below to explore it.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 mb-16 md:mb-12 text-left">
                            {sections.map((section, i) => {
                                // 2:3:2 masonry style across 12 cols
                                let span = ''

                                // Row 1 (2 items): col-span-6 each
                                if (i === 0 || i === 1) span = 'md:col-span-6'
                                // Row 2 (3 items): col-span-4 each
                                else if (i >= 2 && i <= 4) span = 'md:col-span-4'
                                // Row 3 (2 items): col-span-6 each
                                else span = 'md:col-span-6'

                                return (
                                    <div key={section.name} className={`${span}`}>
                                        <SectionCard section={section} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="py-24 md:py-40 border-t border-white/5">
                    <div className="container mx-auto max-w-4xl px-6">
                        <h2 className="section-title text-center mb-12 md:mb-24">
                            <span className="title-white">SYSTEM</span> <span className="title-yellow">FAQ.</span>
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-sor7ed-yellow text-black rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(245,198,20,0.3)] transition-all duration-300">
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full text-left p-6 md:p-8 flex justify-between items-center group"
                                    >
                                        <span className={`text-[12px] md:text-sm font-black uppercase tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-black' : 'text-black/70 group-hover:text-black'}`}>
                                            {faq.q}
                                        </span>
                                        <span className="text-2xl font-light">{activeFaq === i ? '−' : '+'}</span>
                                    </button>
                                    {activeFaq === i && (
                                        <div className="px-6 md:px-8 pb-6 md:pb-8 text-black/80 text-sm leading-relaxed font-normal border-t border-black/10 pt-6 animate-in fade-in duration-500">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="pb-40"></div>
            </main>
        </div>
    )
}
