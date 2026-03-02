import { useState } from 'react'

export default function EmailCapture() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        // Simulate API call
        setTimeout(() => {
            setStatus('success')
        }, 1500)
    }

    if (status === 'success') {
        return (
            <div className="stealth-card p-12 text-center border-sor7ed-yellow/20">
                <span className="text-4xl mb-6 block">⚡</span>
                <h3 className="text-2xl font-black uppercase tracking-[0.15em] text-white mb-4">You're in the Loop.</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Check your inbox for the "Neuro-Architect's Handbook" (PDF).</p>
            </div>
        )
    }

    return (
        <section className="py-24 bg-sor7ed-yellow/[0.02] border-y border-white/5">
            <div className="container mx-auto px-6 max-w-xl text-center">
                <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4">// FOLLOW_UP</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.15em] mb-8">GET THE <span className="text-sor7ed-yellow">HACKS.</span></h2>
                <p className="text-zinc-500 font-light leading-relaxed mb-10">
                    Not ready for WhatsApp? Get weekly ADHD protocols and a free copy of the <strong>5 ADHD Hacks That Actually Work</strong> PDF.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER_EMAIL_ADDRESS"
                        className="flex-grow bg-black border border-white/10 rounded-full py-4 px-8 text-xs font-mono text-white focus:outline-none focus:border-sor7ed-yellow transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 px-10 rounded-full hover:bg-sor7ed-yellow transition-all duration-500 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'SYNCING...' : 'SEND_PDF'}
                    </button>
                </form>
            </div>
        </section>
    )
}
