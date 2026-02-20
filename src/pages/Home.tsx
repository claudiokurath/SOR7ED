import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'
import { tools as fallbackTools } from '../data/tools'
import { articles as fallbackArticles } from '../data/articles'
import SignupModal from '../components/SignupModal'

// Re-using the updated BranchCard that I just fixed in previous turns
import BranchCard from '../components/BranchCard'


export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [whatsappUrl, setWhatsappUrl] = useState('')
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [activeToolObject, setActiveToolObject] = useState<any>(null)
    const navigate = useNavigate()

    // Fetch tools and articles from API routes
    const { data: dynamicTools } = useNotionData<any>('/api/tools', fallbackTools)
    const { data: dynamicArticles } = useNotionData<any>('/api/articles', fallbackArticles)

    // Unified tool interaction handling
    const handleToolClick = (tool: any) => {
        setActiveToolObject(tool)
        setSelectedTemplate(tool.name)
        const url = `https://wa.me/447966628285?text=${tool.whatsappKeyword || tool.name}`
        setWhatsappUrl(url)
        setIsSignupOpen(true)
    }

    const handlePostClick = (post: any) => {
        navigate(`/blog/${encodeURIComponent(post.title)}`)
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
                <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40 filter grayscale scale-105">
                    <source src="/Intro.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section - Logo Only */}
            <section id="hero" className="relative h-screen flex flex-col justify-center items-center z-10">
                <div className="animate-in fade-in duration-1000">
                    <img src="/logo.png" alt="SOR7ED" className="w-64 md:w-96 h-auto object-contain drop-shadow-2xl opacity-90" />
                </div>
            </section>

            {/* Intro / Next Chapter Section */}
            <section id="intro" className="relative py-24 px-6 z-10 min-h-screen flex flex-col justify-center">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center">

                        <h2 className="text-lg md:text-2xl text-white font-bold uppercase tracking-[0.2em] mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                            Tiny phone-based tools for ADHD brains
                        </h2>
                        <p className="text-zinc-500 max-w-xl font-light leading-relaxed mb-12 text-sm md:text-base tracking-wide animate-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
                            Unstick yourself from <span className="text-zinc-300">time blindness</span>, <span className="text-zinc-300">overwhelm</span>, and <span className="text-zinc-300">sensory overload</span>.
                            <br />
                            <span className="block mt-4 text-sor7ed-yellow/60 text-xs uppercase tracking-widest">Tap a 2-5 minute interactive tool. Get instant relief.</span>
                        </p>

                        {/* Outcome Bullets */}
                        <div className="flex flex-col md:flex-row gap-8 mb-20 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
                            {[
                                "Start tasks without overwhelm",
                                "Catch hyperfocus early",
                                "Regulate sensory input"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <span className="text-sor7ed-yellow text-[10px]">●</span>
                                    <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 mb-32 animate-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
                            <a href="#lab" className="btn-primary w-full sm:w-auto">Initialize Tools</a>
                        </div>

                        {/* How It Works Section */}
                        <section className="py-24 relative z-10 w-full">
                            <div className="container mx-auto max-w-6xl px-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                                    {[
                                        { step: "01", title: "Select", desc: "Choose a micro-tool based on your current block." },
                                        { step: "02", title: "Engage", desc: "Answer 3-5 prompts to bypass executive dysfunction." },
                                        { step: "03", title: "Release", desc: "Get an instant Micro-Plan directly on your device." }
                                    ].map((s) => (
                                        <div key={s.step} className="flex flex-col items-center group">
                                            <div className="text-[9px] font-mono-headline text-zinc-600 mb-6 tracking-widest">STEP {s.step}</div>
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{s.title}</h3>
                                            <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-xs">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 border-y border-sor7ed-yellow/20 py-12 w-full max-w-4xl backdrop-blur-sm bg-black/10">
                            {[
                                { label: 'Latency', value: 'Zero' },
                                { label: 'Friction', value: 'None' },
                                { label: 'Access', value: 'Global' }
                            ].map(stat => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-[10px] font-mono-headline text-zinc-500 mb-2 uppercase tracking-widest">{stat.label}</div>
                                    <div className="text-2xl font-black text-white tracking-widest uppercase">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* The Foundation & Vectors Section */}
            <section id="about" className="py-40 relative flex flex-col items-center">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
                    <div className="mb-24 text-center flex flex-col items-center">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE 7</span> <span className="title-yellow">VECTORS.</span>
                        </h2>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        {/* Row 1: Connection / Mind (2 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[320px]">
                            {['Connection', 'Mind'].map(name => {
                                const branch = branches.find(b => b.name === name);
                                if (!branch) return null;
                                return <BranchCard key={name} branch={branch} className="h-full" />;
                            })}
                        </div>

                        {/* Row 2: Body / Tech / Wealth (3 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[320px]">
                            {['Body', 'Tech', 'Wealth'].map(name => {
                                const branch = branches.find(b => b.name === name);
                                if (!branch) return null;
                                return <BranchCard key={name} branch={branch} className="h-full" />;
                            })}
                        </div>

                        {/* Row 3: Growth / Impression (2 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[320px]">
                            {['Growth', 'Impression'].map(name => {
                                const branch = branches.find(b => b.name === name);
                                if (!branch) return null;
                                return <BranchCard key={name} branch={branch} className="h-full" />;
                            })}
                        </div>
                    </div>

                </div>
            </section>

            {/* Tools Section / Registry */}
            <section id="lab" className="py-40 px-6 flex flex-col items-center">
                <div className="container mx-auto max-w-7xl text-center flex flex-col items-center">
                    <div className="max-w-3xl mb-24">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                        {dynamicTools.length > 0 ? (
                            dynamicTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    onClick={() => handleToolClick(tool)}
                                    className="stealth-card rounded-2xl p-10 group cursor-pointer hover:border-sor7ed-yellow/30 transition-all duration-500 text-left h-[400px] flex flex-col justify-center"
                                >
                                    <div className="text-5xl mb-8 opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">{tool.emoji || '🛠️'}</div>
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4 group-hover:text-sor7ed-yellow transition-colors">{tool.name}</h3>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-h-32 overflow-hidden">{tool.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-zinc-600 font-mono-headline text-xs">Registry Empty // Check Notion Status: Live</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Blog Section / Insights */}
            <section id="blog" className="py-40 px-6 flex flex-col items-center">
                <div className="container mx-auto max-w-7xl flex flex-col items-center">
                    <div className="max-w-3xl mb-24 text-center">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE</span> <span className="title-yellow">INSIGHTS.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                        {dynamicArticles.length > 0 ? (
                            dynamicArticles.map((post, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePostClick(post)}
                                    className="stealth-card rounded-2xl group cursor-pointer hover:border-white/20 transition-all duration-700 flex flex-col overflow-hidden h-[400px]"
                                >
                                    <div className="p-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.2em]">{post.branch}</span>
                                                <span className="text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.2em]">{post.date}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-sor7ed-yellow transition-colors uppercase tracking-tight mb-4 leading-tight">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex justify-end">
                                            <span className="text-zinc-700 group-hover:text-white transition-colors text-lg">→</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-2xl w-full">
                                <p className="text-zinc-600 font-mono-headline text-xs">Repository Syncing // Check Notion Status: Published</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-40 border-y border-white/5">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { quote: "For the first time I can actually start tasks on time without the shame spiral.", role: "ADHD Creative" },
                            { quote: "The Body Double tool is the only thing that gets me through my admin backlog.", role: "AuDHD Founder" },
                            { quote: "Finally a system that doesn't demand perfection. It just asks for 2 minutes.", role: "Late Diagnosed" }
                        ].map((t, i) => (
                            <div key={i} className="p-8 relative group">
                                <div className="text-6xl text-white/5 absolute -top-4 -left-4 font-serif">"</div>
                                <p className="text-zinc-400 font-light leading-loose mb-8 relative z-10 text-lg">"{t.quote}"</p>
                                <div className="mt-6 text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.3em]">
                  // {t.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-40 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-24">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">COMMON</span> <span className="title-yellow">QUERIES.</span>
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="stealth-card overflow-hidden transition-all duration-500">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full text-left p-8 flex justify-between items-center group"
                                >
                                    <span className={`text-base md:text-lg font-bold uppercase tracking-[0.15em] transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-500 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                    <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                        {activeFaq === i ? '−' : '+'}
                                    </div>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-96 opacity-100 px-8 pb-8 pt-0' : 'max-h-0 opacity-0 px-8 pb-0 pt-0 overflow-hidden'}`}>
                                    <p className="text-zinc-400 font-light leading-loose text-sm md:text-base border-t border-white/5 pt-6">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Layer */}
            <section className="py-60 px-6 relative overflow-hidden border-t border-sor7ed-yellow/20">
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="section-title mb-16 leading-[0.9]">
                        <span className="title-white">READY TO</span> <br /><span className="title-yellow">EVOLVE?</span>
                    </h2>
                    <div className="flex justify-center">
                        <a href="https://wa.me/447360277713?text=Hi" target="_blank" rel="noopener noreferrer" className="btn-primary scale-110 hover:scale-125 transition-transform">
                            Initialize Connection
                        </a>
                    </div>
                    <p className="mt-20 text-zinc-700 font-mono-headline text-[10px] tracking-[0.5em] uppercase">
                        No friction. No noise. Just systems.
                    </p>
                </div>
            </section>

            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                template={selectedTemplate}
                whatsappUrl={whatsappUrl}
            />
        </div>
    )
}
