import { useParams, useNavigate } from 'react-router-dom'
import { useVault } from '../context/VaultContext'
import { useNotionData } from '../hooks/useNotionData'
import { useEffect, useState } from 'react'
import FavoriteButton from '../components/FavoriteButton'
import DeployModal from '../components/DeployModal'
import { formatContent } from '../utils/formatContent'

// Import all interactive tools
import FocusTimer from '../components/tools/FocusTimer'
import DopamineMenu from '../components/tools/DopamineMenu'
import BodyDouble from '../components/tools/BodyDouble'
import MoodTracker from '../components/tools/MoodTracker'
import TaskBreaker from '../components/tools/TaskBreaker'
import SensoryFidget from '../components/tools/SensoryFidget'
import DynamicTool from '../components/tools/DynamicTool'

const ToolDetail = () => {
    const { keyword } = useParams<{ keyword: string }>()
    const navigate = useNavigate()
    const { isLoggedIn, isLoading: sessionLoading } = useVault()
    const { data: apiTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const [tool, setTool] = useState<any>(null)
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)

    useEffect(() => {
        if (!sessionLoading && !isLoggedIn) {
            navigate('/vault')
        }
    }, [isLoggedIn, sessionLoading, navigate])

    useEffect(() => {
        const allTools = apiTools
        const found = allTools.find(t =>
            t.whatsappKeyword?.toLowerCase() === keyword?.toLowerCase() ||
            t.name?.toLowerCase().replace(/\s+/g, '-') === keyword?.toLowerCase()
        )
        setTool(found)
    }, [apiTools, keyword])

    if (sessionLoading || toolsLoading) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!tool) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center px-6">
                <h1 className="text-4xl font-fuel-decay text-white uppercase mb-4">Tool Not Found</h1>
                <button onClick={() => navigate('/tools')} className="text-sor7ed-yellow uppercase tracking-[0.15em] text-xs">Return to Lab</button>
            </div>
        )
    }

    const handleDeploy = () => {
        setIsDeployModalOpen(true)
    }

    // Mapping keyword to specialized interactive components
    const renderInteractiveTool = () => {
        const k = tool.whatsappKeyword?.toUpperCase()

        switch (k) {
            case 'TIME':
                return <FocusTimer onDeploy={handleDeploy} />
            case 'DOPAMINE':
                return <DopamineMenu onDeploy={handleDeploy} />
            case 'DOUBLE':
                return <BodyDouble onDeploy={handleDeploy} />
            case 'ENERGY':
                return <MoodTracker onDeploy={handleDeploy} />
            case 'BREAK':
                return <TaskBreaker onDeploy={handleDeploy} />
            case 'FIDGET':
                return <SensoryFidget onDeploy={handleDeploy} />
            default:
                // If the tool has a template, use DynamicTool
                if (tool.template) {
                    return <DynamicTool tool={tool} onDeploy={handleDeploy} />
                }

                // Compose a blog-like content from the tool's properties
                let combinedContent = tool.description ? `\n\n${tool.description}\n\n` : ''
                if (tool.problemStatement) combinedContent += `## The Problem\n${tool.problemStatement}\n\n`
                if (tool.howItWorks) combinedContent += `## How It Works\n${tool.howItWorks}\n\n`
                if (tool.whatYouGet) combinedContent += `## What You Get\n${tool.whatYouGet}\n\n`
                if (tool.whoItsFor) combinedContent += `## Who It's For\n${tool.whoItsFor}\n\n`

                // Fallback for tools without an interactive version yet, styled like a blog post
                return (
                    <article className="animate-in fade-in duration-1000 max-w-4xl mx-auto">
                        {/* Cover Image */}
                        {tool.coverImage ? (
                            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-20 border border-white/5 shadow-2xl relative group">
                                <img
                                    src={tool.coverImage}
                                    alt={tool.name}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        ) : (
                            <div className="w-full h-48 rounded-3xl overflow-hidden mb-20 border border-white/5 shadow-2xl relative group bg-zinc-900/50 flex items-center justify-center">
                                <div className="text-5xl grayscale opacity-50">{tool.emoji || '⚙️'}</div>
                            </div>
                        )}

                        {/* Article Header */}
                        <div className="mb-20">
                            <h1 className="text-6xl md:text-8xl font-fuel-decay text-white uppercase">
                                {tool.name}
                            </h1>
                        </div>

                        {/* Content Area */}
                        <div className="stealth-card p-10 md:p-20 mb-20">
                            <div
                                className="blog-content text-zinc-400 font-light leading-relaxed text-lg space-y-8"
                                dangerouslySetInnerHTML={{ __html: formatContent(combinedContent) }}
                            />

                            {/* Ending logic */}
                            <div className="mt-24 pt-12 border-t border-white/5 text-center">
                                <span className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-[0.5em] italic">
                                    [End of System Protocol]
                                </span>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="stealth-card p-12 md:p-16 text-center relative border-sor7ed-yellow/20 bg-gradient-to-br from-sor7ed-yellow/5 to-transparent mb-20">
                            <div className="space-y-8">
                                <div className="h-px w-24 bg-sor7ed-yellow/30 mx-auto"></div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-[0.15em]">Ready to hand this off?</h3>
                                <p className="text-zinc-500 font-light leading-relaxed max-w-lg mx-auto">
                                    Initialize the operational protocol on your primary device. No friction. Just help.
                                </p>
                                <button
                                    onClick={handleDeploy}
                                    className="btn-primary"
                                >
                                    Deploy to WhatsApp
                                </button>
                                <div className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">
                                    // Deployment via WhatsApp Secure Node
                                </div>
                            </div>
                        </div>
                    </article>
                )
        }
    }

    return (
        <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto">
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            <div className="relative z-10 pt-32 pb-40 px-6 container mx-auto max-w-7xl">
                <div className="mb-12 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-zinc-500 hover:text-white transition-colors flex items-center gap-4 text-[10px] font-mono-headline uppercase tracking-[0.15em]"
                    >
                        <span>← Back</span>
                    </button>
                    {tool && <FavoriteButton itemId={tool.id} itemType="tool" />}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
                    {renderInteractiveTool()}
                </div>
            </div>

            <DeployModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                keyword={tool.whatsappKeyword || tool.name}
                title={tool.name}
            />
        </div>
    )
}

export default ToolDetail
