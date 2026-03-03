import { useState, useEffect } from 'react'
import { useVault } from '../context/VaultContext'
import AuthModal from './AuthModal'

interface DeployModalProps {
    isOpen: boolean
    onClose: () => void
    keyword: string
    title: string
}

export default function DeployModal({ isOpen, onClose, keyword, title }: DeployModalProps) {
    const { isLoggedIn } = useVault()
    const [showAuth, setShowAuth] = useState(false)

    useEffect(() => {
        if (!isOpen) setShowAuth(false)
    }, [isOpen])

    if (!isOpen) return null

    const handleDeploy = () => {
        if (!isLoggedIn) {
            setShowAuth(true)
            return
        }
        const whatsappUrl = `https://wa.me/447360277713?text=${encodeURIComponent(keyword)}`
        window.open(whatsappUrl, '_blank')
        onClose()
    }

    if (showAuth) {
        return <AuthModal isOpen={true} onClose={() => setShowAuth(false)} initialMode="signup" />
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-zinc-950 border border-sor7ed-yellow/20 rounded-2xl p-8 md:p-12 animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden shadow-2xl">
                {/* Background pulse */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sor7ed-yellow/10 blur-[50px] rounded-full pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-zinc-500 hover:text-white text-[10px] font-mono-headline tracking-[0.2em] uppercase transition-colors"
                >
                    Close [ESC]
                </button>

                <h2 className="text-3xl md:text-5xl font-fuel-decay text-white uppercase tracking-[0.1em] mb-4">
                    INITIALIZE <span className="text-sor7ed-yellow">PROTOCOL.</span>
                </h2>
                <div className="text-[10px] font-mono-headline text-zinc-500 mb-8 uppercase tracking-[0.2em]">
                    // TARGET: {title}
                </div>

                <div className="space-y-6 mb-10 text-center">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Complete the connection process to receive detailed instructions on how to use this tool, along with a direct link to the app, straight to your WhatsApp.
                    </p>
                </div>

                <button
                    onClick={handleDeploy}
                    className="w-full bg-sor7ed-yellow text-black font-fuel-decay uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-yellow-400 transition-all text-sm md:text-base shadow-[0_0_30px_rgba(245,198,20,0.2)] hover:shadow-[0_0_40px_rgba(245,198,20,0.4)]"
                >
                    CONNECT TO WHATSAPP NOW
                </button>
            </div>
        </div>
    )
}
