import { useState } from 'react'
import BranchCard from '../components/BranchCard'
import { branches } from '../data/branches'
import { tools } from '../data/tools'
import { articles } from '../data/articles'

export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)

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
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400">System Architecture for ADHD</span>
                        </div>

                        <h1 className="section-title leading-[0.9] lg:text-9xl mb-12">
                            CLARITY FOR <br />
                            <span className="accent-glow">MOVING BRAINS.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl font-light leading-relaxed mb-16">
                            Sophisticated, low-friction tools for executive function.
                            <span className="text-white"> Instant deployment via WhatsApp.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8">
                            <a href="#tools" className="btn-primary">Initialize Tools</a>
                            <a href="https://wa.me/447360277713?text=Hi" className="btn-secondary">Message Concierge</a>
                        </div>

                        <div className="mt-32 grid grid-cols-2 md:grid-cols-3 gap-12 border-y border-white/5 py-12 w-full max-w-4xl">
                            {[
                                { label: 'Latency', value: 'Zero' },
                                { label: 'Friction', value: 'None' },
                                { label: 'Access', value: 'Global' }
                            ].map(stat => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2 font-black">{stat.label}</div>
                                    <div className="text-2xl font-bold text-white tracking-widest uppercase">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Foundation Section */}
            <section id="about" className="py-32 px-6 relative">
                <div className="container mx-auto max-w-5xl">
                    <div className="stealth-card p-12 md:p-20 relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <div className="text-9xl font-black">7</div>
                        </div>

                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
                                The <span className="text-sor7ed-yellow">Foundation.</span>
                            </h2>
                            <div className="space-y-8 text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                                <p>
                                    SOR7ED is a premium system delivering high-fidelity tools for neurodivergent minds. We publish 3 core updates per week.
                                </p>
                                <p className="text-white font-medium">
                                    Every insight includes an <span className="text-sor7ed-yellow italic">Interactive Protocol</span> you can initialize via WhatsApp.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-6">
                                    {['No Fluff', 'No Signup', 'Pure Data'].map(tag => (
                                        <span key={tag} className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest font-black text-zinc-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7 Branches / Vectors Grid */}
            <section id="branches" className="py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">THE 7 <span className="text-sor7ed-yellow">VECTORS.</span></h2>
                            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold leading-relaxed">Life is a system of 7 core processes. Optimization requires individual attention.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {branches.map((branch, index) => (
                            <BranchCard key={branch.name} branch={branch} delay={index * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-32 px-6 border-y border-white/5">
                <div className="container mx-auto max-w-7xl">
                    <div className="max-w-3xl mb-16">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-sor7ed-yellow mb-4">Functional Registry</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">INTERACTIVE <span className="accent-glow italic font-light">KITS.</span></h2>
                        <p className="text-xl text-zinc-500 font-light max-w-xl mt-6">
                            Low-latency systems for executive function. Zero cognitive load, maximum deployment speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => (
                            <div key={tool.name} className="stealth-card p-12 group cursor-pointer border-white/5 hover:border-sor7ed-yellow transition-all duration-500">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">{tool.name}</h3>
                                <p className="text-sm text-zinc-500 font-light mb-10 leading-relaxed h-12 overflow-hidden">{tool.desc}</p>
                                <div className="flex items-center space-x-3 text-[10px] font-black tracking-[0.3em] text-sor7ed-yellow transition-all">
                                    <span className="uppercase">Run Protocol</span>
                                    <span className="w-8 h-px bg-sor7ed-yellow/30 group-hover:w-12 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="max-w-3xl mb-32">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-sor7ed-yellow mb-4">Central Repository</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">THE <span className="accent-glow italic font-light">INSIGHTS.</span></h2>
                        <p className="text-xl text-zinc-500 font-light mt-6">
                            High-fidelity writing for the neurodivergent operating system. Updated 3x weekly.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-5xl">
                        {articles.map((post, i) => (
                            <div key={i} className="stealth-card p-6 group cursor-pointer hover:bg-white/[0.02]">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-16 flex-grow">
                                        <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 font-mono italic uppercase min-w-[100px]">{post.date}</span>
                                        <h2 className="text-xl font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-[0.1em]">{post.title}</h2>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <span className="text-[10px] font-black tracking-[0.3em] text-sor7ed-yellow uppercase italic">{post.category}</span>
                                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 group-hover:border-sor7ed-yellow/30 group-hover:text-sor7ed-yellow transition-all">
                                            <span className="text-xs">VIEW</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-32 px-6 bg-zinc-900/10">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-24">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-sor7ed-yellow mb-4">Manual / Documentation</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">COMMON <span className="accent-glow italic font-light">QUERIES.</span></h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="stealth-card border border-white/5 overflow-hidden transition-all">
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
                                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-screen opacity-100 border-t border-white/5 p-12' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
            <section className="py-40 px-6 relative overflow-hidden border-t border-white/5">
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter uppercase leading-[0.9]">
                        Ready to <br /><span className="text-sor7ed-yellow accent-glow italic font-light">Evolve?</span>
                    </h2>
                    <a href="https://wa.me/447360277713?text=Hi" target="_blank" rel="noopener noreferrer" className="btn-primary transform hover:scale-110">
                        Initialize Connection
                    </a>
                    <p className="mt-12 text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">
                        No friction. No noise. Just systems.
                    </p>
                </div>
            </section>
        </div>
    )
}
