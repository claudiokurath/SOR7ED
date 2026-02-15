import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { branches } from '../data/branches'
import { getBlogPosts, getTools } from '../utils/notion'
import SignupModal from '../components/SignupModal'
import DopamineMenu from '../components/tools/DopamineMenu'

export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [dynamicTools, setDynamicTools] = useState<any[]>([])
    const [dynamicArticles, setDynamicArticles] = useState<any[]>([])

    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [whatsappUrl, setWhatsappUrl] = useState('')
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogPosts = await getBlogPosts()
                const toolsData = await getTools()

                // Only update if we actually get data back from the API
                if (blogPosts && blogPosts.length > 0) {
                    setDynamicArticles(blogPosts)
                }

                if (toolsData && toolsData.length > 0) {
                    setDynamicTools(toolsData)
                }
            } catch (error) {
                console.error("Failed to sync with repository, using local cache.")
            }
        }
        fetchData()
    }, [])

    const handleToolClick = (tool: any) => {
        if (tool.name === 'Dopamine Menu') {
            setActiveToolId('dopamine-menu')
            return
        }

        setSelectedTemplate(tool.name)
        const url = `https://wa.me/447360277713?text=${tool.keyword || tool.name}`
        setWhatsappUrl(url)

        if (tool.isPublic) {
            window.location.href = url
        } else {
            setIsSignupOpen(true)
        }
    }

    const handlePostClick = (post: any) => {
        navigate(`/blog/${encodeURIComponent(post.title)}`)
    }


    const faqs = [
        { q: "What is SOR7ED?", a: "SOR7ED is a premium system delivering high-fidelity tools and insights specifically for neurodivergent minds." },
        { q: "How do I use the tools?", a: "Select a tool from our registry. You can use it instantly on the site or send the listed keyword to our WhatsApp concierge for mobile deployment." },
        { q: "Is it really free?", a: "Yes. All our core tools and articles are free. We believe in removing friction, not adding subscription fatigue." },
        { q: "How does the WhatsApp concierge work?", a: "Once you have a keyword (like 'DOPAMINE'), just text it to +44 7360 277713. Our system will immediately return the relevant protocol or template." }
    ]

    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="relative pt-48 pb-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-12 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 bg-sor7ed-yellow rounded-full animate-ping" />
                            <span className="text-[10px] font-mono-headline text-zinc-400">System Architecture for ADHD</span>
                        </div>

                        <h1 className="section-title leading-[0.8] lg:text-[12rem] md:text-[10rem] text-[5rem] mb-12 tracking-tighter">
                            <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl font-light leading-relaxed mb-16">
                            Sophisticated, low-friction tools for executive function.
                            <span className="text-white"> Instant deployment via WhatsApp.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8">
                            <a href="#tools" className="btn-primary">Initialize Tools</a>
                            <a href="https://wa.me/447360277713?text=Hi" className="btn-secondary">Message Concierge</a>
                        </div>

                        <div className="mt-32 grid grid-cols-2 md:grid-cols-3 gap-12 border-y border-sor7ed-yellow py-12 w-full max-w-4xl">
                            {[
                                { label: 'Latency', value: 'Zero' },
                                { label: 'Friction', value: 'None' },
                                { label: 'Access', value: 'Global' }
                            ].map(stat => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-[10px] font-mono-headline text-zinc-500 mb-2">{stat.label}</div>
                                    <div className="text-2xl font-bold text-white tracking-widest uppercase">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* The Foundation & Vectors Section */}
            <section id="about" className="py-32 relative flex flex-col items-center">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
                    <div className="max-w-4xl mx-auto stealth-card p-12 md:p-16 mb-32 relative overflow-hidden group border-sor7ed-yellow text-center flex flex-col items-center">
                        {/* Huge background watermark */}
                        <div className="absolute top-0 right-10 text-[260px] font-black text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-sor7ed-yellow/[0.04] transition-colors duration-1000">7</div>

                        <div className="relative z-10">
                            <h2 className="section-title">
                                <span className="title-white">THE</span> <span className="title-yellow">FOUNDATION.</span>
                            </h2>
                            <div className="max-w-2xl">
                                <p className="text-zinc-500 font-light leading-relaxed mb-6 text-lg">
                                    SOR7ED is a premium system delivering high-fidelity tools for neurodivergent minds. We publish 3 core updates per week.
                                </p>
                                <p className="text-zinc-400 font-light leading-relaxed mb-12 text-lg">
                                    Every insight includes an <span className="text-sor7ed-yellow italic">Interactive Protocol</span> you can initialize via WhatsApp.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <span className="stealth-tag border-sor7ed-yellow text-sor7ed-yellow">No Fluff</span>
                                    <span className="stealth-tag border-sor7ed-yellow/60 text-white">Quick Signup</span>
                                    <span className="stealth-tag">Pure Data</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-20 text-center flex flex-col items-center">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE 7</span> <span className="title-yellow">VECTORS.</span>
                        </h2>
                        <p className="text-zinc-600 font-mono-headline text-[10px] tracking-widest uppercase">
                            Life is a system of 7 core processes. Optimization requires individual attention.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {branches.map((branch) => (
                            <div key={branch.name} className="stealth-card p-8 group hover:border-white transition-all duration-500">
                                <div className="flex flex-col h-full">
                                    <div className="mb-8 overflow-hidden">
                                        <div className="w-8 h-px bg-zinc-800 mb-4 group-hover:bg-sor7ed-yellow transition-colors" />
                                        <span className="text-[9px] font-mono-headline text-zinc-600 group-hover:text-sor7ed-yellow transition-colors uppercase tracking-[0.2em] block">
                                            VECTOR {branch.name}
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">{branch.name}</h3>
                                        <p className="text-[13px] text-zinc-500 font-light leading-relaxed mb-8">{branch.description}</p>
                                    </div>
                                    <div className="mt-10 pt-6 border-t border-zinc-900 flex items-center justify-between">
                                        <span className="text-[9px] font-mono-headline text-zinc-700 uppercase tracking-widest">Protocol 07</span>
                                        <span className="text-[14px] text-zinc-800 group-hover:text-sor7ed-yellow transition-colors">+</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Tools Section / Registry */}
            <section id="tools" className="py-32 px-6 border-y border-sor7ed-yellow/20 flex flex-col items-center">
                <div className="container mx-auto max-w-7xl text-center flex flex-col items-center">
                    <div className="max-w-3xl mb-16">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE</span> <span className="title-yellow">REGISTRY.</span>
                        </h2>
                        <p className="text-zinc-600 font-mono-headline text-xs tracking-widest uppercase">
                            Operational protocols for immediate cognitive relief.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dynamicTools.length > 0 ? (
                            dynamicTools.map((tool) => (
                                <div
                                    key={tool.name}
                                    onClick={() => handleToolClick(tool)}
                                    className="stealth-card p-12 group cursor-pointer hover:border-sor7ed-yellow transition-all duration-500"
                                >
                                    <div className="text-4xl mb-6">{tool.icon}</div>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">{tool.name}</h3>
                                    <p className="text-sm text-zinc-500 font-light mb-10 leading-relaxed h-12 overflow-hidden">{tool.desc}</p>
                                    <div className="flex items-center space-x-3 text-[10px] font-black tracking-[0.3em] text-sor7ed-yellow transition-all">
                                        <span className="uppercase">Run Protocol</span>
                                        <span className="w-8 h-px bg-sor7ed-yellow/30 group-hover:w-12 transition-all" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                                <p className="text-zinc-600 font-mono-headline text-xs">Registry Empty // Check Notion Status: Live</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Blog Section / Insights */}
            <section id="blog" className="py-32 px-6 flex flex-col items-center">
                <div className="container mx-auto max-w-7xl flex flex-col items-center">
                    <div className="max-w-3xl mb-24 text-center">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE</span> <span className="title-yellow">INSIGHTS.</span>
                        </h2>
                        <p className="text-zinc-600 font-mono-headline text-xs tracking-widest uppercase">
                            Deep analysis of neuro-architectural patterns.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                        {dynamicArticles.length > 0 ? (
                            dynamicArticles.map((post, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePostClick(post)}
                                    className="stealth-card p-0 group cursor-pointer hover:border-sor7ed-yellow transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="w-full h-64 overflow-hidden border-b border-zinc-900 filter grayscale group-hover:grayscale-0 transition-all duration-700">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800 font-mono-headline text-[10px] tracking-widest uppercase">
                                                Media Missing
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-10 flex flex-col items-center w-full">
                                        <div className="text-[10px] font-mono-headline text-zinc-600 italic uppercase mb-6 tracking-[0.2em]">{post.date}</div>
                                        <h3 className="text-xl font-black text-white group-hover:text-sor7ed-yellow transition-colors uppercase tracking-widest mb-8 flex items-center justify-center text-center">
                                            {post.title}
                                        </h3>
                                        <div className="mt-auto pt-6 border-t border-zinc-900 w-full flex items-center justify-between">
                                            <span className="text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-widest italic">{post.category}</span>
                                            <div className="w-8 h-8 rounded-full border border-sor7ed-yellow/30 flex items-center justify-center text-zinc-700 group-hover:border-sor7ed-yellow group-hover:text-sor7ed-yellow transition-all">
                                                <span className="text-[10px]">&rarr;</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl w-full">
                                <p className="text-zinc-600 font-mono-headline text-xs">Repository Syncing // Check Notion Status: Published</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section / Documentation */}
            <section id="faq" className="py-32 px-6 bg-zinc-900/10 border-t border-white/5">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-24">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">COMMON</span> <span className="title-yellow">QUERIES.</span>
                        </h2>
                        <p className="text-zinc-600 font-mono-headline text-[10px] tracking-widest uppercase">
                            Manual // Documentation // Support
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="stealth-card overflow-hidden transition-all">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full text-left p-8 flex justify-between items-center group"
                                >
                                    <span className={`text-xl font-bold uppercase tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-500 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                    <div className="w-8 h-8 flex items-center justify-center relative">
                                        <span className={`absolute w-4 h-0.5 bg-current transition-all duration-300 ${activeFaq === i ? 'rotate-45' : ''}`} />
                                        <span className={`absolute w-0.5 h-4 bg-current transition-all duration-300 ${activeFaq === i ? 'opacity-0' : ''}`} />
                                    </div>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-screen opacity-100 border-t border-sor7ed-yellow p-12' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <p className="text-zinc-500 font-light leading-relaxed text-lg uppercase tracking-wide">
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
            {/* Interactive Tool Overlay */}
            {activeToolId && (
                <div className="fixed inset-0 bg-black/95 z-[60] overflow-y-auto px-6 py-20 animate-in fade-in duration-500">
                    <div className="container mx-auto max-w-5xl relative">
                        <button
                            onClick={() => setActiveToolId(null)}
                            className="absolute -top-12 right-0 text-white/50 hover:text-white font-mono-headline text-xs tracking-widest flex items-center space-x-2"
                        >
                            <span>[ CLOSE SYSTEM ]</span>
                            <span className="text-lg">×</span>
                        </button>

                        {activeToolId === 'dopamine-menu' && <DopamineMenu />}
                    </div>
                </div>
            )}


            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                template={selectedTemplate}
                whatsappUrl={whatsappUrl}
            />
        </div>
    )
}
