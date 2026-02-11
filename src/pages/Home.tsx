import { Link } from 'react-router-dom'
import BranchCard from '../components/BranchCard'
import { branches } from '../data/branches'

export default function Home() {
    return (
        <div className="bg-black text-white">
            {/* Hero Section with Background Image */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sor7ed-yellow/10 via-black to-black"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 text-center animate-slide-up">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        ADHD-friendly tools.
                        <br />
                        <span className="text-sor7ed-yellow">Delivered to your phone.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Quick interactive tools for executive function, time blindness, and sensory overload.
                        <strong className="text-white"> Get instant results via WhatsApp.</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/tools" className="btn-primary">
                            Try Free Tools
                        </Link>
                        <a
                            href="https://wa.me/447360277713?text=Hi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                        >
                            Message on WhatsApp
                        </a>
                    </div>

                    <p className="mt-8 text-gray-400 text-sm">
                        ✅ No apps to download  •  ✅ No subscriptions  •  ✅ Just helpful stuff
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <svg className="w-6 h-6 text-sor7ed-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* What is SOR7ED Section */}
            <section className="py-20 px-6 bg-sor7ed-gray">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="section-title text-center">What is SOR7ED?</h2>
                    <div className="space-y-6 text-lg text-gray-300">
                        <p className="text-xl leading-relaxed">
                            <strong className="text-white">SOR7ED is a free platform publishing practical tools and content for neurodivergent people.</strong> We publish 3 articles per week about ADHD, autism, dyslexia, and executive dysfunction.
                        </p>
                        <p className="text-xl leading-relaxed">
                            Every article includes a <span className="text-sor7ed-yellow font-bold">free template you can get via WhatsApp.</span>
                        </p>
                        <p className="text-2xl font-bold text-center text-sor7ed-yellow mt-8">
                            Built for ADHD brains, not neurotypical productivity fantasies.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <span className="px-4 py-2 bg-black border border-sor7ed-yellow rounded-full text-sm">No fluff. Just actionable help.</span>
                            <span className="px-4 py-2 bg-black border border-sor7ed-yellow rounded-full text-sm">No sign-ups. No forms.</span>
                            <span className="px-4 py-2 bg-black border border-sor7ed-yellow rounded-full text-sm">Text a keyword, get a template.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* The 7 Branches */}
            <section className="py-20 px-6 bg-black">
                <div className="container mx-auto">
                    <h2 className="section-title text-center mb-4">The 7 Branches</h2>
                    <p className="text-center text-gray-400 mb-12 text-lg">Every topic we cover falls into one of 7 life areas</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {branches.map((branch, index) => (
                            <BranchCard key={branch.name} branch={branch} delay={index * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-sor7ed-gray">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="section-title text-center mb-16">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-sor7ed-yellow rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-black group-hover:scale-110 transition-transform shadow-lg shadow-sor7ed-yellow/50">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Read a blog post</h3>
                            <p className="text-gray-400">Browse our articles on ADHD, time blindness, RSD, sensory overload, and more.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-24 h-24 bg-sor7ed-yellow rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-black group-hover:scale-110 transition-transform shadow-lg shadow-sor7ed-yellow/50">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Find the keyword</h3>
                            <p className="text-gray-400">Each post has a WhatsApp keyword (like WALL, TIMERAILS, ACTIONKIT).</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-24 h-24 bg-sor7ed-yellow rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-black group-hover:scale-110 transition-transform shadow-lg shadow-sor7ed-yellow/50">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Text the keyword</h3>
                            <p className="text-gray-400">Send it to <strong className="text-white">+44 7360 277713</strong> and get your free template instantly.</p>
                        </div>
                    </div>

                    <p className="text-center mt-12 text-xl text-gray-300">
                        That's it. <span className="text-sor7ed-yellow font-bold">No email capture. No login.</span> Just help when you need it.
                    </p>
                </div>
            </section>

            {/* Featured Tools Preview */}
            <section className="py-20 px-6 bg-black">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="section-title text-center mb-4">Interactive Tools</h2>
                    <p className="text-center text-gray-400 mb-12 text-lg">Try our free ND-friendly tools</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: '🎯', name: 'Dopamine Menu', desc: 'Create your personal menu of quick dopamine hits' },
                            { icon: '⚡', name: 'Executive Function Triage', desc: 'Sort overwhelming tasks into manageable next steps' },
                            { icon: '⏰', name: 'Time Blindness Calculator', desc: 'See where your time really goes (ADHD-adjusted)' },
                        ].map((tool) => (
                            <div key={tool.name} className="bg-sor7ed-gray p-6 rounded-lg border border-sor7ed-gray-light card-hover">
                                <div className="text-5xl mb-4">{tool.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                                <p className="text-gray-400 mb-4">{tool.desc}</p>
                                <Link to="/tools" className="text-sor7ed-yellow hover:underline font-medium">
                                    Try it →
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/tools" className="btn-primary">
                            View All Tools
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-sor7ed-yellow to-yellow-600">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Ready to try?</h2>
                    <p className="text-xl text-black/80 mb-8">
                        No commitment. No signup. Just say hi and see how it works.
                    </p>
                    <a
                        href="https://wa.me/447360277713?text=Hi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-sor7ed-yellow px-12 py-5 rounded-lg text-xl font-bold hover:bg-gray-900 transition-all transform hover:scale-105 shadow-2xl"
                    >
                        📱 Message on WhatsApp
                    </a>
                </div>
            </section>

            {/* Who This Is For */}
            <section className="py-20 px-6 bg-sor7ed-gray">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="section-title text-center mb-12">Who This Is For</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-black p-8 rounded-lg border-2 border-green-500/50">
                            <h3 className="text-2xl font-bold mb-4 text-green-400">✅ You're in the right place if:</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li>✓ You regularly miss small but important tasks</li>
                                <li>✓ You know what to do but can't start</li>
                                <li>✓ Traditional productivity advice doesn't work for you</li>
                                <li>✓ You're tired of apps that add more complexity</li>
                            </ul>
                        </div>

                        <div className="bg-black p-8 rounded-lg border-2 border-red-500/50">
                            <h3 className="text-2xl font-bold mb-4 text-red-400">❌ This isn't for you if:</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li>✗ You need crisis mental health support (call 116 123)</li>
                                <li>✗ You enjoy admin and find it straightforward</li>
                                <li>✗ You're looking for a magic overnight fix</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
