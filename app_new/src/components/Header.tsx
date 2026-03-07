import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useVault } from '../context/VaultContext'

interface HeaderProps {
    onOpenAuth: (mode?: 'signup' | 'signin') => void
}

const Header = ({ onOpenAuth }: HeaderProps) => {
    const { isLoggedIn, user, logout } = useVault()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="bg-black border-b border-white/5 fixed top-0 left-0 w-full z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <Link to="/" className="text-white text-xl font-black font-fuel-decay tracking-[0.15em] hover:text-sor7ed-yellow transition-colors mr-2">
                            SOR7ED
                        </Link>
                        {location.pathname !== '/' && (
                            <Link to="/" className="hidden md:block text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                Home
                            </Link>
                        )}
                        {location.pathname !== '/tools' && (
                            <Link to="/tools" className="hidden md:block text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                Tools
                            </Link>
                        )}
                        {location.pathname !== '/blog' && (
                            <Link to="/blog" className="hidden md:block text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                Blog
                            </Link>
                        )}
                        {location.pathname !== '/about' && (
                            <Link to="/about" className="hidden md:block text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                About
                            </Link>
                        )}
                        <Link to="/vault" className="text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-400 hover:text-sor7ed-yellow transition-colors border border-white/5 bg-white/[0.03] px-3 md:px-4 py-2 rounded-lg">
                            Vault
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        {isLoggedIn ? (
                            <>
                                <span className="hidden md:inline text-[10px] font-fuel-decay text-sor7ed-yellow uppercase tracking-[0.2em]">
                                    // {user?.name || 'OPERATOR'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onOpenAuth('signin')}
                                    className="text-[10px] font-fuel-decay uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => onOpenAuth('signup')}
                                    className="bg-sor7ed-yellow text-black px-4 md:px-8 py-2 md:py-3 rounded-full font-fuel-decay uppercase text-[10px] md:text-[11px] tracking-[0.15em] hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,198,20,0.1)]"
                                >
                                    <span className="md:hidden">Start</span>
                                    <span className="hidden md:inline">Start Operating</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
