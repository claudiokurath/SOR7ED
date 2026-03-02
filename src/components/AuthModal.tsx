import React, { useState, useEffect } from 'react'
import { useVault } from '../context/VaultContext'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    initialMode?: 'signup' | 'signin'
}

const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) => {
    const { isLoggedIn } = useVault()
    const [mode, setMode] = useState<'signup' | 'signin'>(initialMode)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Sync mode when initialMode changes or modal opens
    useEffect(() => {
        setMode(initialMode)
        setMessage(null)
    }, [initialMode, isOpen])

    // Signup State
    const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', password: '' })

    // Signin State
    const [signinEmail, setSigninEmail] = useState('')
    const [signinPassword, setSigninPassword] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: signupData.name,
                    email: signupData.email,
                    phoneNumber: signupData.phone,
                    password: signupData.password,
                    leadSource: 'Landing Page',
                    signupDate: new Date().toISOString().split('T')[0],
                    status: 'Trial',
                    freeToolsUsed: 0,
                    creditsBalance: 0
                })
            })
            const data = await res.json()
            if (res.ok) {
                setMessage({ type: 'success', text: 'Welcome to the Registry. Check your WhatsApp for initialization.' })
                setSignupData({ name: '', email: '', phone: '', password: '' })
            } else {
                setMessage({ type: 'error', text: data.message || data.error || 'Registration failed. Please try again.' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error. Trace signal lost.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signinEmail, password: signinPassword })
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('sor7ed_vault_token', data.token)
                setMessage({ type: 'success', text: 'Authentication successful. Synchronizing...' })
                setTimeout(() => window.location.href = '/vault', 1000)
            } else {
                setMessage({ type: 'error', text: data.message || data.error || 'Authentication failed.' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server error. Authentication protocol offline.' })
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen || (isLoggedIn && mode === 'signup')) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto py-20">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg animate-in zoom-in slide-in-from-bottom-8 duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-zinc-500 hover:text-white transition-colors"
                >
                    <span className="text-[10px] font-mono-headline tracking-[0.3em] uppercase">Close [ESC]</span>
                </button>

                <div className="stealth-card p-8 md:p-12 border-sor7ed-yellow/20 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sor7ed-yellow/5 blur-[50px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex bg-zinc-950 p-1 rounded-full border border-white/5 mb-8 w-fit mx-auto">
                            <button
                                onClick={() => { setMode('signup'); setMessage(null); }}
                                className={`px-6 py-2 rounded-full text-[9px] font-league-gothic uppercase tracking-[0.15em] transition-all ${mode === 'signup' ? 'bg-sor7ed-yellow text-black' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Join Registry
                            </button>
                            <button
                                onClick={() => { setMode('signin'); setMessage(null); }}
                                className={`px-6 py-2 rounded-full text-[9px] font-league-gothic uppercase tracking-[0.15em] transition-all ${mode === 'signin' ? 'bg-sor7ed-yellow text-black' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Access Vault
                            </button>
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-league-gothic text-white uppercase tracking-[0.15em] mb-4 ">
                                {mode === 'signup' ? 'ESTABLISH' : 'RETRIEVE'} <br />
                                <span className="text-sor7ed-yellow">{mode === 'signup' ? 'CONNECTION.' : 'PROTOCOL.'}</span>
                            </h2>
                            <p className="text-zinc-500 font-light text-[11px] md:text-xs tracking-wide uppercase max-w-xs mx-auto">
                                {mode === 'signup'
                                    ? "Start trial. Get 2 tool requests delivered to your phone immediately."
                                    : "Enter your email to receive a secure login link via WhatsApp."}
                            </p>
                        </div>

                        <form onSubmit={mode === 'signup' ? handleSignup : handleSignin} className="space-y-6">
                            {mode === 'signup' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">// FULL_NAME</label>
                                        <input
                                            type="text"
                                            required
                                            value={signupData.name}
                                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light text-sm"
                                            placeholder="Identification name..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">// WHATSAPP_NUMBER</label>
                                        <input
                                            type="tel"
                                            required
                                            value={signupData.phone}
                                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light text-sm"
                                            placeholder="+44 7XXX XXXXXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">// CREATE_PASSWORD</label>
                                        <input
                                            type="password"
                                            required
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light text-sm"
                                            placeholder="New password..."
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="block text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">
                                    // {mode === 'signup' ? 'REGISTRY_EMAIL' : 'IDENTIFICATION_EMAIL'}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={mode === 'signup' ? signupData.email : signinEmail}
                                    onChange={(e) => mode === 'signup' ? setSignupData({ ...signupData, email: e.target.value }) : setSigninEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light text-sm"
                                    placeholder="entry@email.com..."
                                />
                            </div>

                            {mode === 'signin' && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em]">// SECURITY_CREDENTIAL</label>
                                    <input
                                        type="password"
                                        required
                                        value={signinPassword}
                                        onChange={(e) => setSigninPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light text-sm"
                                        placeholder="Enter password..."
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-zinc-950 font-league-gothic uppercase py-6 rounded-xl hover:bg-sor7ed-yellow hover:text-black transition-all disabled:opacity-50 tracking-[0.2em] text-[13px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                            >
                                {isLoading ? 'TRANSMITTING...' : (mode === 'signup' ? 'INITIALIZE CONNECTION' : 'REQUEST ACCESS')}
                            </button>

                            {message && (
                                <div className={`p-5 rounded-xl text-[11px] font-league-gothic uppercase tracking-[0.15em] text-center animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success'
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                    }`}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <p className="text-zinc-700 text-[8px] text-center mt-6 uppercase tracking-[0.4em] font-mono-headline">
                    // END_TO_END_ENCRYPTION_ACTIVE //
                </p>
            </div>
        </div>
    )
}

export default AuthModal
