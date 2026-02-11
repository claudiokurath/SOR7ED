import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="fixed w-full top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-sor7ed-gray">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-sor7ed-yellow rounded flex items-center justify-center font-black text-black text-xl transition-transform group-hover:scale-110">
                            7
                        </div>
                        <span className="text-2xl font-bold text-sor7ed-yellow">SOR7ED</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-white hover:text-sor7ed-yellow transition font-medium">
                            Home
                        </Link>
                        <Link to="/tools" className="text-white hover:text-sor7ed-yellow transition font-medium">
                            Tools
                        </Link>
                        <Link to="/blog" className="text-white hover:text-sor7ed-yellow transition font-medium">
                            Blog
                        </Link>
                        <Link to="/about" className="text-white hover:text-sor7ed-yellow transition font-medium">
                            About
                        </Link>
                        <a
                            href="https://wa.me/447360277713?text=Hi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm py-2 px-6"
                        >
                            Get Started
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
                        <Link to="/" className="block text-white hover:text-sor7ed-yellow transition">Home</Link>
                        <Link to="/tools" className="block text-white hover:text-sor7ed-yellow transition">Tools</Link>
                        <Link to="/blog" className="block text-white hover:text-sor7ed-yellow transition">Blog</Link>
                        <Link to="/about" className="block text-white hover:text-sor7ed-yellow transition">About</Link>
                        <a
                            href="https://wa.me/447360277713?text=Hi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block btn-primary text-center"
                        >
                            Get Started
                        </a>
                    </nav>
                )}
            </div>
        </header>
    )
}
