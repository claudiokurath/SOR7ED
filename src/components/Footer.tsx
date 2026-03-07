const Footer = () => {
    return (
        <footer className="bg-black border-t border-gray-800 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <img src="/logo.png" alt="SOR7ED" className="h-8 w-auto object-contain opacity-90 mb-4" />
                        <p className="text-gray-400 text-sm">
                            ADHD-friendly tools and resources for neurodivergent adults.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="/" className="hover:text-sor7ed-yellow transition-colors">Home</a></li>
                            <li><a href="/tools" className="hover:text-sor7ed-yellow transition-colors">Tools</a></li>
                            <li><a href="/blog" className="hover:text-sor7ed-yellow transition-colors">Blog</a></li>
                            <li><a href="/about" className="hover:text-sor7ed-yellow transition-colors">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: hello@sor7ed.com</li>
                            <li>WhatsApp: +44 7360 277713</li>
                            <li>London, UK</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Company #16398701</li>
                            <li>© 2026 SOR7ED LIMITED</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
