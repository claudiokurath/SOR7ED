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
                    <div className="flex items-center">
                        <Link to="/" className="text-white text-[2rem] md:text-[2.5rem] font-normal tracking-[0.15em] hover:text-sor7ed-yellow transition-colors mr-2">
                            <span className="text-sor7ed-yellow">SOR7ED</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-8">
                        {isLoggedIn ? (
                            <>
                                <div className="hidden md:flex space-x-4">
                                    <Link to="/vault" className="text-[12px] font-mono-headline uppercase tracking-[0.2em] text-white hover:text-sor7ed-yellow transition-colors border border-white/20 bg-white/[0.03] px-6 py-3 rounded-full">
                                        Vault
                                    </Link>
                                </div>
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
                                    className="text-[10px] font-mono-headline uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                                >
                                    Sign In
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
