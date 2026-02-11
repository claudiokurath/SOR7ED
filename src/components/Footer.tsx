export default function Footer() {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-32 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-6 h-6 bg-white text-black rounded flex items-center justify-center font-black text-[10px]">7</div>
                            <span className="text-sm font-black tracking-[0.4em] uppercase text-white">SOR7ED</span>
                        </div>
                        <p className="text-zinc-600 font-light max-w-sm text-sm leading-relaxed mb-12">
                            High-fidelity tools and systems for neurodivergent operating systems. Designed for clarity, built for focus.
                        </p>
                        <div className="flex space-x-8">
                            <a href="#" className="text-[10px] font-black tracking-widest text-zinc-700 hover:text-white transition-colors uppercase">Status</a>
                            <a href="#" className="text-[10px] font-black tracking-widest text-zinc-700 hover:text-white transition-colors uppercase">Safety</a>
                            <a href="#" className="text-[10px] font-black tracking-widest text-zinc-700 hover:text-white transition-colors uppercase">Legacy</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-400 mb-8">Exploration</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Tools', href: '#tools' },
                                { label: 'Blog', href: '#blog' },
                                { label: 'FAQ', href: '#faq' },
                                { label: 'About', href: '#about' }
                            ].map(item => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="text-xs font-bold text-zinc-600 hover:text-sor7ed-yellow transition-colors cursor-pointer"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-400 mb-8">Uplink</h4>
                        <div className="space-y-4">
                            <a href="https://wa.me/447360277713" target="_blank" rel="noopener noreferrer" className="block text-xs font-bold text-zinc-600 hover:text-white transition-colors">WhatsApp</a>
                            <p className="text-xs font-bold text-zinc-700">hello@sor7ed.com</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-8">
                    <p className="text-[8px] font-black tracking-[0.4em] text-zinc-800 uppercase">
                        &copy; 2026 SOR7ED LIMITED (SYST#16398701)
                    </p>
                    <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-green-500/20 flex items-center justify-center">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <span className="text-[8px] font-black tracking-[0.4em] text-zinc-800 uppercase">System Status: Optimal</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
