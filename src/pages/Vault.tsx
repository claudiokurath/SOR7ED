import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Protocol {
    id: string
    title: string
    branch: string
    trigger: string
    template: string
}

const Vault = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [protocols, setProtocols] = useState<Protocol[]>([])
    const [email, setEmail] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const urlToken = urlParams.get('token')

        if (urlToken) {
            localStorage.setItem('sor7ed_vault_token', urlToken)
            // Clear the token from the URL
            window.history.replaceState({}, document.title, window.location.pathname)
            fetchVaultContent(urlToken)
        } else {
            const token = localStorage.getItem('sor7ed_vault_token')
            if (token) {
                fetchVaultContent(token)
            } else {
                setIsLoading(false)
            }
        }
    }, [])


    const fetchVaultContent = async (token: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/vault/content?token=${token}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                setProtocols(data.protocols)
            } else {
                localStorage.removeItem('sor7ed_vault_token')
            }
        } catch (err) {
            console.error('Failed to fetch vault content')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)
        setMessage(null)

        try {
            const res = await fetch('/api/vault/send-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Magic link sent to your WhatsApp!' })
            } else {
                const data = await res.json()
                setMessage({ type: 'error', text: data.error || 'Check your details and try again.' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto px-6 py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 italic tracking-tight">The Vault</h1>
                    <p className="text-zinc-500">Access your claimed protocols and ND toolkits.</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-widest">Registered Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none transition-colors"
                                placeholder="alex@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full bg-sor7ed-yellow text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(245,198,20,0.15)]"
                        >
                            {isSending ? 'Verifying...' : 'Access Vault'}
                        </button>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-600 mt-8">
                    No account yet? <Link to="/" className="text-sor7ed-yellow hover:underline">Get your first protocol</Link> to create one.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 italic tracking-tight">Welcome, {user.name}</h1>
                    <p className="text-zinc-500">Your curated collection of neuro-architecture kits.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { localStorage.removeItem('sor7ed_vault_token'); window.location.reload(); }}
                        className="px-4 py-2 text-xs text-zinc-500 hover:text-white uppercase tracking-widest border border-white/10 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {protocols.length === 0 ? (
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-zinc-500 mb-6">You haven't claimed any protocols yet.</p>
                    <Link
                        to="/tools"
                        className="inline-block bg-sor7ed-yellow text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-all uppercase tracking-widest text-xs"
                    >
                        Claim Your First Tool
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {protocols.map((protocol) => (
                        <div
                            key={protocol.id}
                            className="group bg-zinc-900/40 border border-white/5 hover:border-sor7ed-yellow/30 rounded-2xl p-6 transition-all hover:translate-y-[-4px] backdrop-blur-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sor7ed-yellow/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sor7ed-yellow/10 transition-colors"></div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase tracking-widest text-zinc-400 border border-white/5">
                                    {protocol.branch}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-sor7ed-yellow transition-colors leading-tight">
                                {protocol.title}
                            </h3>

                            <div className="space-y-4">
                                <Link
                                    to={`/blog/${protocol.title}`}
                                    className="block w-full text-center border border-white/10 bg-white/5 text-white py-3 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
                                >
                                    Review Full Analysis
                                </Link>
                                <button
                                    onClick={() => {
                                        const text = encodeURIComponent(protocol.trigger);
                                        window.open(`https://wa.me/447360277713?text=${text}`, '_blank');
                                    }}
                                    className="block w-full text-center border border-sor7ed-yellow/20 text-sor7ed-yellow py-3 rounded-xl hover:bg-sor7ed-yellow/10 transition-all text-sm font-medium"
                                >
                                    Re-deploy to WhatsApp
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <section className="mt-24">
                <div className="bg-gradient-to-r from-sor7ed-yellow/20 to-transparent p-[1px] rounded-2xl">
                    <div className="bg-black/90 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-4">The Next Level is coming.</h2>
                            <p className="text-zinc-400">Our interactive lab tools (Time Calculators, Triage Bots, and Sensory Audits) are moving into a high-performance web dashboard.</p>
                        </div>
                        <Link
                            to="/tools"
                            className="whitespace-nowrap bg-sor7ed-yellow text-black font-bold px-10 py-4 rounded-full hover:bg-yellow-400 transition-all uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(245,198,20,0.2)]"
                        >
                            Explore Beta Tools
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Vault
