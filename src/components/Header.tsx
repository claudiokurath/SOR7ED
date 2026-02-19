import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-sor7ed-yellow">
                        SOR7ED
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-sor7ed-yellow transition-colors">
                            Home
                        </Link>
                        <Link to="/tools" className="text-gray-300 hover:text-sor7ed-yellow transition-colors">
                            Tools
                        </Link>
                        <Link to="/blog" className="text-gray-300 hover:text-sor7ed-yellow transition-colors">
                            Blog
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-sor7ed-yellow transition-colors">
                            About
                        </Link>
                    </div>
                    <Link
                        to="/tools"
                        className="bg-sor7ed-yellow text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
                    >
                        Try Free Tools
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header
