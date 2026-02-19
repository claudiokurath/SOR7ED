import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Blog from './pages/Blog'
import About from './pages/About'
import Signup from './pages/Signup'

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
                        <Route path="/about" element={<About />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
