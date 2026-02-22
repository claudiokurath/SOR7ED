import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Blog from './pages/Blog'
import About from './pages/About'
import Signup from './pages/Signup'

import BlogPost from './pages/BlogPost'
import Vault from './pages/Vault'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-black flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tools" element={<Tools />} />
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
    )
}

export default App
