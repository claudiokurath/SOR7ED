import { useState, useEffect } from 'react'

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { label: 'Tools', href: '#tools' },
        { label: 'Blog', href: '#blog' },
        { label: 'Faq', href: '#faq' },
        { label: 'About', href: '#about' }
    ]

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMenuOpen(false)
    }

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/10' : 'py-8 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <a
                    href="#hero"
                    onClick={(e) => handleNavClick(e, '#hero')}
                    className="flex items-center space-x-3 group"
                >
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm group-hover:bg-sor7ed-yellow transition-colors">7</div>
                    <span className="text-lg font-black tracking-widest uppercase text-white group-hover:text-sor7ed-yellow transition-colors">SOR7ED</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-12">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="https://wa.me/447360277713?text=Hi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-black tracking-[0.3em] text-sor7ed-yellow border border-sor7ed-yellow/30 px-6 py-2 rounded-full hover:bg-sor7ed-yellow hover:text-black transition-all"
                    >
                        Connect
                    </a>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white transition-colors hover:text-sor7ed-yellow"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="w-6 h-5 flex flex-col justify-between items-end">
                        <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 translate-y-2.5 rotate-45' : 'w-6'}`} />
                        <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
                        <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 -translate-y-2 -rotate-45' : 'w-2'}`} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 py-12' : 'max-h-0 opacity-0'}`}>
                <nav className="container mx-auto px-6 flex flex-col space-y-8 items-center text-center">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="text-lg uppercase font-black tracking-[0.4em] text-zinc-400 hover:text-sor7ed-yellow transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="https://wa.me/447360277713?text=Hi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary bg-sor7ed-yellow/10 border border-sor7ed-yellow/30 text-sor7ed-yellow py-6"
                    >
                        Connect to Concierge
                    </a>
                </nav>
            </div>
        </header>
    )
}
