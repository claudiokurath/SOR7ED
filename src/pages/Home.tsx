import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { branches } from '../data/branches'
import { getBlogPosts, getTools } from '../utils/notion'
import SignupModal from '../components/SignupModal'
import DopamineMenu from '../components/tools/DopamineMenu'
import TimeVisualizer from '../components/tools/TimeVisualizer'
import TaskTriage from '../components/tools/TaskTriage'
import SensoryFidget from '../components/tools/SensoryFidget'
import FocusTimer from '../components/tools/FocusTimer'
import TaskBreaker from '../components/tools/TaskBreaker'
import MoodTracker from '../components/tools/MoodTracker'
import RoutineBuilder from '../components/tools/RoutineBuilder'
import SocialSimulator from '../components/tools/SocialSimulator'
import NoiseMixer from '../components/tools/NoiseMixer'
import BodyDouble from '../components/tools/BodyDouble'
import CommunicationBridge from '../components/tools/CommunicationBridge'
import DynamicTool from '../components/tools/DynamicTool'

export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [dynamicTools, setDynamicTools] = useState<any[]>([])
    const [dynamicArticles, setDynamicArticles] = useState<any[]>([])

    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [whatsappUrl, setWhatsappUrl] = useState('')

    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [activeToolObject, setActiveToolObject] = useState<any>(null)

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

    // Unified tool interaction handling

    const handleToolClick = (tool: any) => {
        const name = tool.name.toLowerCase();
        let targetId = tool.name;

        if (name.includes('dopamine menu')) targetId = 'dopamine-menu'
        else if (name.includes('time') || name.includes('visualizer')) targetId = 'time-visualizer'
        else if (name.includes('triage') || name.includes('executive')) targetId = 'task-triage'
        else if (name.includes('sensory') || name.includes('fidget') || name.includes('bubble')) targetId = 'sensory-fidget'
        else if (name.includes('pomodoro') || name.includes('timer') || name.includes('focus')) targetId = 'focus-timer'
        else if (name.includes('breaker') || name.includes('deconstructor') || name.includes('task') || name.includes('atomic')) targetId = 'task-breaker'
        else if (name.includes('mood') || name.includes('energy') || name.includes('tracker') || name.includes('biometric')) targetId = 'mood-tracker'
        else if (name.includes('routine') || name.includes('builder') || name.includes('architect')) targetId = 'routine-builder'
        else if (name.includes('social') || name.includes('simulator') || name.includes('scenario')) targetId = 'social-simulator'
        else if (name.includes('noise') || name.includes('audio') || name.includes('mixer')) targetId = 'noise-mixer'
        else if (name.includes('body double') || name.includes('presence')) targetId = 'body-double'
        else if (name.includes('communication') || name.includes('email') || name.includes('translator') || name.includes('script')) targetId = 'communication-bridge'

        setActiveToolId(targetId)
        setActiveToolObject(tool)

        // Prepare WhatsApp URL
        setSelectedTemplate(tool.name)
        const url = `https://wa.me/447966628285?text=${tool.keyword || tool.name}`
        setWhatsappUrl(url)
    }

    const handleDeployClick = () => {
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
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-40 filter grayscale scale-105"
                >
                    <source src="/Intro.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="relative pt-48 pb-32 px-6 z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center">


                        <div className="mb-24 flex justify-center animate-in fade-in duration-1000">
                            <img
                                src="/logo.png"
                                alt="SOR7ED"
                                className="h-32 md:h-56 w-auto object-contain drop-shadow-2xl"
                            />
                        </div>

                        <h2 className="text-xl md:text-3xl text-white font-black uppercase tracking-tight mb-6 mt-[-20px]">
                            Tiny phone-based tools for ADHD brains
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed mb-10">
                            Unstick yourself from <span className="text-white">time blindness</span>, <span className="text-white">overwhelm</span>, and <span className="text-white">sensory overload</span>.
                            <br />
                            <span className="text-sor7ed-yellow/80 block mt-2">Tap a 2-5 minute interactive tool. Get instant relief.</span>
                        </p>

                        {/* Outcome Bullets */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 w-full max-w-3xl">
                            {[
                                "Feel less overwhelmed starting tasks",
                                "Catch yourself before hyperfocus hits",
                                "Regulate sensory input instantly"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
                                    <span className="text-sor7ed-yellow">✓</span>
                                    <span className="text-[11px] text-zinc-300 font-medium leading-tight text-left">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 mb-24">
                            <a href="#lab" className="btn-primary w-full sm:w-auto">Initialize Tools</a>
                            <a href="https://wa.me/447360277713?text=Hi" className="btn-secondary w-full sm:w-auto">Message Concierge</a>
                        </div>


                        {/* How It Works Section */}
                        <section className="py-24 border-b border-white/5 relative z-10 bg-black/50 backdrop-blur-md">
                            <div className="container mx-auto max-w-7xl px-6">
                                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
                                    {[
                                        { step: "01", title: "Select", desc: "Choose a micro-tool (Time, Task, Sensory) based on your current block." },
                                        { step: "02", title: "Engage", desc: "Answer 3-5 interactive prompts designed to bypass executive dysfunction." },
                                        { step: "03", title: "Release", desc: "Get an instant Micro-Plan or shifted state directly on your device." }
                                    ].map((s) => (
                                        <div key={s.step} className="flex flex-col items-center max-w-xs group">
                                            <div className="text-[10px] font-mono-headline text-sor7ed-yellow mb-4 border border-sor7ed-yellow/20 px-3 py-1 rounded-full">{s.step}</div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-sor7ed-yellow transition-colors">{s.title}</h3>
                                            <p className="text-sm text-zinc-500 font-light leading-relaxed">{s.desc}</p>
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
            <section id="about" className="py-32 relative flex flex-col items-center">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">


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
            </section >


            {/* Tools Section / Registry */}
            < section id="lab" className="py-32 px-6 border-y border-sor7ed-yellow/20 flex flex-col items-center" >
                <div className="container mx-auto max-w-7xl text-center flex flex-col items-center">
                    <div className="max-w-3xl mb-16">
                        <h2 className="section-title justify-center flex gap-4">
                            <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                        </h2>
                        <p className="text-zinc-600 font-mono-headline text-xs tracking-widest uppercase">
                            Operational protocols for immediate cognitive relief.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dynamicTools.length > 0 ? (
                            dynamicTools
                                .filter(tool => ['noise mixer', 'body double', 'communication bridge'].some(name => tool.name.toLowerCase().includes(name)))
                                .map((tool) => (
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
            </section >

            {/* Blog Section / Insights */}
            < section id="blog" className="py-32 px-6 flex flex-col items-center" >
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
                                        <div className="text-[10px] font-mono-headline text-zinc-600 italic uppercase mb-4 tracking-[0.2em]">{post.date}</div>

                                        <h3 className="text-xl font-black text-white group-hover:text-sor7ed-yellow transition-colors uppercase tracking-widest mb-4 flex items-center justify-center text-center">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt Preview */}
                                        {post.excerpt && (
                                            <p className="text-[13px] text-zinc-500 font-light leading-relaxed mb-8 h-12 overflow-hidden italic">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-6 border-t border-zinc-900 w-full flex items-center justify-between">
                                            <span className="text-[11px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.2em] italic font-bold">
                                                {post.category}
                                            </span>
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
            </section >

            {/* Social Proof Section */}
            <section className="py-32 border-t border-b border-sor7ed-yellow/10 bg-zinc-900/20">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.3em]">
                            Validated by Neurodivergent Minds
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { quote: "For the first time I can actually start tasks on time without the shame spiral.", role: "ADHD Creative" },
                            { quote: "The Body Double tool is the only thing that gets me through my admin backlog.", role: "AuDHD Founder" },
                            { quote: "Finally a system that doesn't demand perfection. It just asks for 2 minutes.", role: "Late Diagnosed" }
                        ].map((t, i) => (
                            <div key={i} className="bg-black/40 border border-white/5 p-8 relative">
                                <div className="text-4xl text-sor7ed-yellow/20 absolute top-4 left-4">“</div>
                                <p className="text-zinc-300 font-light italic leading-loose mb-6 relative z-10">"{t.quote}"</p>
                                <div className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-widest text-right">
                                     // {t.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section / Documentation */}
            < section id="faq" className="py-32 px-6 bg-zinc-900/10 border-t border-white/5" >
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
            </section >

            {/* Final CTA Layer */}
            < section className="py-60 px-6 relative overflow-hidden border-t border-sor7ed-yellow/20" >
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
            </section >
            {/* Interactive Tool Overlay */}
            {
                activeToolId && (
                    <div className="fixed inset-0 bg-black/95 z-[60] overflow-y-auto px-6 py-20 animate-in fade-in duration-500">
                        <div className="container mx-auto max-w-5xl relative">
                            <button
                                onClick={() => setActiveToolId(null)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white font-mono-headline text-xs tracking-widest flex items-center space-x-2"
                            >
                                <span>[ CLOSE SYSTEM ]</span>
                                <span className="text-lg">×</span>
                            </button>

                            <div className="absolute -top-12 left-0 flex space-x-6">
                                <button
                                    onClick={() => window.print()}
                                    className="text-white/30 hover:text-sor7ed-yellow font-mono-headline text-[10px] tracking-[0.2em] flex items-center space-x-2 transition-all"
                                >
                                    <span>[ DOWNLOAD PDF ]</span>
                                </button>
                            </div>

                            {activeToolId === 'dopamine-menu' && <DopamineMenu onDeploy={handleDeployClick} />}
                            {activeToolId === 'time-visualizer' && <TimeVisualizer onDeploy={handleDeployClick} />}
                            {activeToolId === 'task-triage' && <TaskTriage onDeploy={handleDeployClick} />}
                            {activeToolId === 'sensory-fidget' && <SensoryFidget onDeploy={handleDeployClick} />}
                            {activeToolId === 'focus-timer' && <FocusTimer onDeploy={handleDeployClick} />}
                            {activeToolId === 'task-breaker' && <TaskBreaker onDeploy={handleDeployClick} />}
                            {activeToolId === 'mood-tracker' && <MoodTracker onDeploy={handleDeployClick} />}
                            {activeToolId === 'routine-builder' && <RoutineBuilder onDeploy={handleDeployClick} />}
                            {activeToolId === 'social-simulator' && <SocialSimulator onDeploy={handleDeployClick} />}
                            {activeToolId === 'noise-mixer' && <NoiseMixer onDeploy={handleDeployClick} />}
                            {activeToolId === 'body-double' && <BodyDouble onDeploy={handleDeployClick} />}
                            {activeToolId === 'communication-bridge' && <CommunicationBridge onDeploy={handleDeployClick} />}

                            {!['dopamine-menu', 'time-visualizer', 'task-triage', 'sensory-fidget', 'focus-timer', 'task-breaker', 'mood-tracker', 'routine-builder', 'social-simulator', 'noise-mixer', 'body-double', 'communication-bridge'].includes(activeToolId as string) && activeToolObject && (
                                <DynamicTool tool={activeToolObject} onDeploy={handleDeployClick} />
                            )}
                        </div>
                    </div>
                )
            }


            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                template={selectedTemplate}
                whatsappUrl={whatsappUrl}
            />
        </div >
    )
}
