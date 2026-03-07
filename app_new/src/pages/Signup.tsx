import SignupForm from '../components/SignupForm'

const Signup = () => {
    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Premium Background Overlay */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 pt-40 pb-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-24 animate-in fade-in">
                        <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// TRIAL_ENROLLMENT</span>
                        <h1 className="section-title justify-center flex gap-4">
                            <span className="title-white">GET</span> <span className="title-yellow">2 FREE.</span>
                        </h1>
                        <p className="text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed mt-6">
                            Experience the ADHD-friendly concierge service. No credit card required. No commitment. Just helpful systems.
                        </p>
                    </div>

                    {/* What You Get Section */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            { icon: "⚡", title: "Instant Setup", desc: "Receive your welcome sequence on WhatsApp in < 60s." },
                            { icon: "🎁", title: "2 Free Tools", desc: "Request any 2 protocols from our registry at no cost." },
                            { icon: "💬", title: "WhatsApp First", desc: "No app downloads. No logins. High-performance help." }
                        ].map((item, i) => (
                            <div key={i} className="stealth-card p-10 text-center group transition-all duration-500 hover:border-white/20 animate-in fade-in slide-in-from-bottom-20" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">{item.icon}</div>
                                <h3 className="text-lg font-black uppercase tracking-[0.15em] text-white mb-4">{item.title}</h3>
                                <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="animate-in fade-in delay-500">
                        <SignupForm />
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-40 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.4em] block mb-4">// LOGISTICS</span>
                            <h2 className="text-4xl font-black text-white uppercase tracking-[0.15em]">Quick Queries.</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { q: "What happens next?", a: "You'll receive a WhatsApp message immediately with instructions to request your first protocol." },
                                { q: "Is there a catch?", a: "No. All tools and protocols are completely free to use without any credit limits right now." },
                                { q: "Can I cancel?", a: "There's nothing to cancel. No subscriptions. No spam. Just stop texting whenever." },
                                { q: "Is it secure?", a: "We use enterprise-grade encryption for all data and never sell your information." }
                            ].map((faq, i) => (
                                <div key={i} className="stealth-card p-8">
                                    <h3 className="text-sm font-black text-sor7ed-yellow uppercase tracking-[0.15em] mb-4">{faq.q}</h3>
                                    <p className="text-zinc-500 text-sm font-light leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
