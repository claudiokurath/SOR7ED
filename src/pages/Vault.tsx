import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVault } from '../context/VaultContext'

interface Protocol {
  id: string
  title: string
  branch: string
  trigger: string
  type: 'blog' | 'tool'
}

const Vault = () => {
  const [searchParams] = useSearchParams()
  const { isLoggedIn, isLoading: sessionLoading, user, logout, toggleSave } = useVault()
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (isLoggedIn) {
      fetchVaultContent()
    }
  }, [isLoggedIn])

  const fetchVaultContent = async () => {
    const token = localStorage.getItem('sor7ed_vault_token')
    if (!token) return

    setIsLoadingContent(true)
    try {
      const res = await fetch(`/api/vault/content?token=${token}`)
      const data = await res.json()

      if (res.ok) {
        setProtocols(data.protocols)
      } else {
        setMessage({ type: 'error', text: data.error || 'Access expired or invalid' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' })
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setMessage(null)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('sor7ed_vault_token', data.token)
        window.location.reload() // Simplest way to re-init context with everything
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to login' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' })
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (sessionLoading || (isLoggedIn && protocols.length === 0 && isLoadingContent)) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto">
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
      </div>

      {user ? (
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24">
          <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in">
            <div>
              <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// VAULT_ACCESS_GRANTED</span>
              <h1 className="text-white ">Welcome, <span className="text-sor7ed-yellow">{user.name}</span></h1>
              <p className="text-zinc-500 mt-4 font-light tracking-wide max-w-xl text-sm md:text-base">Your secure repository of neural protocols and architectural frameworks.</p>
            </div>
            <button
              onClick={logout}
              className="px-8 py-3 text-[10px] font-league-gothic text-zinc-500 hover:text-white uppercase tracking-[0.2em] border border-white/5 bg-white/[0.03] rounded-full transition-all"
            >
              De-authorize Session
            </button>
          </header>

          <div className="space-y-24">
            {['Mind', 'Wealth', 'Body', 'Tech'].map(branch => {
              const branchProtocols = protocols.filter(p => p.branch === branch)
              if (branchProtocols.length === 0) return null

              return (
                <section key={branch} className="animate-in fade-in slide-in-from-bottom-10">
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="text-white">{branch}</h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                    <span className="text-[10px] font-mono text-zinc-700 tracking-[0.5em]">// {branchProtocols.length} NODES</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {branchProtocols.map((protocol, i) => (
                      <div key={protocol.id} className="stealth-card p-10 group transition-all duration-500 hover:border-white/20">
                        <div className="flex justify-between items-start mb-8">
                          <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.3em] font-bold tracking-[0.4em]">// {protocol.type.toUpperCase()}</span>
                          <div className={`w-10 h-1 rounded-full ${branch === 'Mind' ? 'bg-purple-500/20 group-hover:bg-purple-500/40' :
                            branch === 'Wealth' ? 'bg-green-500/20 group-hover:bg-green-500/40' :
                              branch === 'Body' ? 'bg-red-500/20 group-hover:bg-red-500/40' :
                                'bg-sor7ed-yellow/20 group-hover:bg-sor7ed-yellow/40'
                            } transition-colors`}></div>
                        </div>
                        <h3 className="text-white mb-8 group-hover:text-sor7ed-yellow transition-colors ">
                          {protocol.title}
                        </h3>
                        <div className="space-y-4">
                          <Link
                            to={protocol.type === 'blog' ? `/blog/${encodeURIComponent(protocol.title)}` : `/tool/${protocol.trigger.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block w-full text-center border border-white/5 bg-white/[0.02] text-white py-4 rounded-xl hover:bg-white/[0.05] transition-all text-[10px] font-league-gothic uppercase tracking-[0.15em]"
                          >
                            Access Module
                          </Link>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleSave(protocol.id, protocol.type)}
                              className="flex-1 text-center border border-white/5 bg-white/[0.01] text-zinc-600 py-3 rounded-lg hover:text-red-500 hover:border-red-500/20 transition-all text-[8px] font-league-gothic uppercase tracking-[0.15em]"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => window.open(`https://wa.me/447360277713?text=${encodeURIComponent(protocol.trigger)}`, '_blank')}
                              className="flex-[2] text-center border border-sor7ed-yellow/10 text-sor7ed-yellow py-3 rounded-lg hover:bg-sor7ed-yellow/5 transition-all text-[8px] font-league-gothic uppercase tracking-[0.15em]"
                            >
                              WhatsApp Deploy
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}

            {protocols.filter(p => !['Mind', 'Wealth', 'Body', 'Tech'].includes(p.branch)).length > 0 && (
              <section className="animate-in fade-in">
                {/* Uncategorized items */}
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-2xl font-league-gothic text-white uppercase tracking-[0.15em]">Other</h2>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {protocols.filter(p => !['Mind', 'Wealth', 'Body', 'Tech'].includes(p.branch)).map((protocol, i) => (
                    <div key={protocol.id} className="stealth-card p-10 group">
                      {/* ... similar card content ... */}
                      <h3 className="text-3xl font-league-gothic text-white uppercase mb-8">{protocol.title}</h3>
                      <Link to={protocol.type === 'blog' ? `/blog/${encodeURIComponent(protocol.title)}` : `/tool/${protocol.trigger.toLowerCase().replace(/\s+/g, '-')}`} className="btn-primary w-full block text-center">Open</Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <section className="mt-40 animate-in fade-in delay-1000">
            <div className="stealth-card p-10 md:p-16 border-white/5 bg-black">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-league-gothic text-white uppercase tracking-[0.15em] mb-4 ">The Evolution Continues.</h2>
                  <p className="text-zinc-500 font-light leading-relaxed text-sm md:text-base">Our interactive lab tools are migrating into a high-performance neural dashboard. Beta access is active.</p>
                </div>
                <Link to="/tools" className="bg-sor7ed-yellow text-black px-10 py-4 rounded-full font-league-gothic uppercase text-[10px] tracking-[0.15em] hover:scale-110 transition-transform whitespace-nowrap">Explore Beta Tools</Link>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-in zoom-in duration-500">
            <div className="text-center mb-12">
              <img src="/logo.png" className="w-40 mx-auto mb-8 opacity-90" alt="SOR7ED" />
              <h1 className="text-3xl font-league-gothic text-white uppercase tracking-[0.15em] mb-2 ">The Vault</h1>
              <p className="text-zinc-500 font-mono-headline text-[10px] uppercase tracking-[0.3em]">Authentication Required</p>
            </div>

            <div className="stealth-card p-8 md:p-10 border-sor7ed-yellow/5">
              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// REGISTRY_ID (EMAIL)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow focus:outline-none transition-all font-light"
                    placeholder="Enter registered email..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-headline text-zinc-600 mb-3 uppercase tracking-[0.15em]">// SECURITY_KEY (PASSWORD)</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow focus:outline-none transition-all font-light"
                    placeholder="Enter password..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-white text-zinc-950 font-league-gothic py-6 rounded-xl hover:bg-sor7ed-yellow hover:text-black transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  {isAuthenticating ? 'Authenticating...' : 'Authorize Session'}
                </button>

                {message && (
                  <div className={`p-6 rounded-xl text-[10px] font-league-gothic uppercase tracking-[0.15em] text-center animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                    }`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>

            <div className="mt-20">
              <p className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-[0.15em] text-center mb-8">// REGISTRY_PREVIEW</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: 'Dopamine Fasting V4', branch: 'Mind', status: 'Locked' },
                  { title: 'Impulse Shield', branch: 'Wealth', status: 'Locked' },
                  { title: 'Circadian Sync', branch: 'Body', status: 'Locked' }
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl opacity-40 blur-[0.5px]">
                    <div>
                      <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.15em]">{p.branch}</p>
                      <p className="text-xs font-league-gothic text-white uppercase tracking-[0.15em]">{p.title}</p>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-800 border border-zinc-800 px-2 py-1 rounded uppercase tracking-[0.2em]">{p.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="text-[10px] text-zinc-600 font-light leading-relaxed">
                  Once authenticated, these protocols are deployed directly to your WhatsApp. <br />
                  Everything is searchable and instant. No apps.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/" className="text-[10px] font-league-gothic uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors decoration-sor7ed-yellow/20 underline-offset-8 hover:underline">Return to Surface</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vault
