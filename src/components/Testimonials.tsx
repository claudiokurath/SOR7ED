const testimonials = [
    {
        quote: "I used to miss major bills every single month. The Impulse Filter and WhatsApp reminders actually stick in my brain unlike every other app.",
        author: "Alex D.",
        role: "Creative Director"
    },
    {
        quote: "Finally, something that doesn't feel like a chore. The tools are minimal, fast, and delivered where I already spend my time.",
        author: "Sarah L.",
        role: "Software Engineer"
    },
    {
        quote: "The 'Brain Dump' protocol is the only way I've been able to sleep without my mind racing at 100mph. Life changing.",
        author: "Marcus K.",
        role: "Founders"
    }
]

export default function Testimonials() {
    return (
        <section id="proof" className="py-24 border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// SOCIAL_PROOF</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.15em]">BETA <span className="text-sor7ed-yellow">TESTIMONIALS.</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="stealth-card p-10 flex flex-col justify-between">
                            <p className="text-zinc-400 font-light leading-relaxed italic mb-8">
                                "{t.quote}"
                            </p>
                            <div>
                                <p className="text-white font-black uppercase tracking-[0.15em] text-xs">{t.author}</p>
                                <p className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] mt-1">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <p className="text-zinc-700 font-mono-headline text-[10px] uppercase tracking-[0.3em]">Join 240+ neurodivergent minds getting sor7ed</p>
                </div>
            </div>
        </section>
    )
}
