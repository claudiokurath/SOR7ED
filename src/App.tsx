import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogPost from './pages/BlogPost'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#050505] flex flex-col text-white">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        {/* Fallback to Home for all other routes to support the single-page experience */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
