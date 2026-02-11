import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-sor7ed-gray border-t border-sor7ed-gray-light">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="text-2xl font-bold text-sor7ed-yellow mb-4">SOR7ED</div>
                        <p className="text-gray-400 text-sm">
                            ADHD-friendly tools delivered to your phone. Worry less, live more.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sor7ed-yellow font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                            <li><Link to="/tools" className="text-gray-400 hover:text-white transition">Tools</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sor7ed-yellow font-bold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sor7ed-yellow font-bold mb-4">Get in Touch</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>📱 +44 7360 277713</li>
                            <li>📧 hello@sor7ed.com</li>
                            <li>🌐 sor7ed.com</li>
                            <li className="pt-2">
                                <a
                                    href="https://wa.me/447360277713?text=Hi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-sor7ed-yellow text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition"
                                >
                                    WhatsApp Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-sor7ed-gray-light mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2026 SOR7ED LIMITED (Company #16398701). All rights reserved.</p>
                    <p className="mt-2">Built for neurodivergent minds. No judgment, just support.</p>
                </div>
            </div>
        </footer>
    )
}
