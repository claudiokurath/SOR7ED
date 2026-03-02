import React, { useState } from 'react'
import { useVault } from '../context/VaultContext'

const AuthSection = () => {
    const { isLoggedIn } = useVault()
    const [mode, setMode] = useState<'signup' | 'signin'>('signup')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

    if (isLoggedIn) return null

    return (
        <section id="auth" className="py-24 md:py-40 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                    <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/10 mb-8 md:mb-12">
                        <button
                            onClick={() => { setMode('signup'); setMessage(null); }}
                            className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-mono-headline uppercase tracking-[0.15em] transition-all ${mode === 'signup' ? 'bg-sor7ed-yellow text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Join Registry
                        </button>
                        <button
                            onClick={() => { setMode('signin'); setMessage(null); }}
                            className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-mono-headline uppercase tracking-[0.15em] transition-all ${mode === 'signin' ? 'bg-sor7ed-yellow text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Access Vault
                        </button>
                    </div>

                    <h2 className="text-3xl md:text-6xl font-league-gothic text-white uppercase text-center tracking-[0.15em] mb-4 ">
                        {mode === 'signup' ? 'ESTABLISH YOUR' : 'RETRIEVE YOUR'} <br />
                        <span className="text-sor7ed-yellow">{mode === 'signup' ? 'CONNECTION.' : 'PROTOCOL.'}</span>
                    </h2>
                    <p className="text-zinc-500 font-light text-center text-sm md:text-base max-w-md mx-auto px-4">
                        {mode === 'signup'
                            ? "Start your free trial today. Get 2 interactive tool requests delivered to your phone immediately."
                            : "Already in the system? Enter your registered email to receive a secure login link via WhatsApp."}
                    </p>
                </div>

                <div className="stealth-card p-8 md:p-16 max-w-lg mx-auto border-sor7ed-yellow/10">
                    <form onSubmit={mode === 'signup' ? handleSignup : handleSignin} className="space-y-8">
                        {mode === 'signup' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// FULL_NAME</label>
                                    <input
                                        type="text"
                                        required
                                        value={signupData.name}
                                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light"
                                        placeholder="Identification name..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// WHATSAPP_NUMBER</label>
                                    <input
                                        type="tel"
                                        required
                                        value={signupData.phone}
                                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light"
                                        placeholder="+44 7XXX XXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// CREATE_PASSWORD</label>
                                    <input
                                        type="password"
                                        required
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light"
                                        placeholder="Secure password..."
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">
                                // {mode === 'signup' ? 'REGISTRY_EMAIL' : 'IDENTIFICATION_EMAIL'}
                            </label>
                            <input
                                type="email"
                                required
                                value={mode === 'signup' ? signupData.email : signinEmail}
                                onChange={(e) => mode === 'signup' ? setSignupData({ ...signupData, email: e.target.value }) : setSigninEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light"
                                placeholder="entry@email.com..."
                            />
                        </div>

                        {mode === 'signin' && (
                            <div>
                                <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// SECURITY_CREDENTIAL</label>
                                <input
                                    type="password"
                                    required
                                    value={signinPassword}
                                    onChange={(e) => setSigninPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow outline-none transition-all font-light"
                                    placeholder="Enter password..."
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-zinc-950 font-league-gothic uppercase py-6 rounded-xl hover:bg-sor7ed-yellow hover:text-black transition-all disabled:opacity-50 tracking-[0.2em] text-[14px] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            {isLoading ? 'TRANSMITTING...' : (mode === 'signup' ? 'INITIALIZE CONNECTION' : 'REQUEST ACCESS')}
                        </button>

                        {message && (
                            <div className={`p-6 rounded-xl text-[12px] font-league-gothic uppercase tracking-[0.15em] text-center animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                }`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>

                <p className="text-zinc-700 text-[9px] text-center mt-12 uppercase tracking-[0.3em] font-mono-headline">
                    // END_TO_END_ENCRYPTION_ACTIVE //
                </p>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-sor7ed-yellow/5 blur-[120px] rounded-full pointer-events-none opacity-20" />
        </section>
    )
}

export default AuthSection
