import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Blog from './pages/Blog'
import About from './pages/About'
import Signup from './pages/Signup'
import AuthModal from './components/AuthModal'

import BlogPost from './pages/BlogPost'
import Vault from './pages/Vault'
import ToolDetail from './pages/ToolDetail'
import { VaultProvider } from './context/VaultContext'

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup')

    const openAuth = (mode: 'signup' | 'signin' = 'signup') => {
        setAuthMode(mode)
        setIsAuthModalOpen(true)
    }

    return (
        <VaultProvider>
            <Router>
                <div className="min-h-screen bg-black flex flex-col">
                    <Header onOpenAuth={openAuth} />
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                        initialMode={authMode}
                    />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home onOpenAuth={openAuth} />} />
                            <Route path="/tools" element={<Tools />} />
                            <Route path="/tool/:keyword" element={<ToolDetail />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:title" element={<BlogPost />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/vault" element={<Vault />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </VaultProvider>
    )
}

export default App
