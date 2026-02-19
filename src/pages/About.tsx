const About = () => {
    return (
        <div className="bg-black">
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold mb-8">About SOR7ED</h1>

                    <div className="space-y-6 text-gray-300">
                        <p className="text-xl">
                            We build <span className="text-sor7ed-yellow font-semibold">ADHD-friendly tools</span> that work with your brain, not against it.
                        </p>

                        <p>
                            Founded in 2025 by Claudio Kurath, SOR7ED started with a simple question: Why is everything so hard?
                        </p>

                        <p>
                            Not because neurodivergent people are broken. Because the world wasn't built for us.
                        </p>

                        <p>
                            So we're building something better. Tools delivered via WhatsApp. No apps. No accounts. No friction. Just instant help when you need it.
                        </p>

                        <h2 className="text-3xl font-bold mt-12 mb-4 text-white">The 7 Branches Framework</h2>
                        <p>
                            Everything we create maps to one of 7 core life areas: MIND, WEALTH, BODY, TECH, CONNECTION, IMPRESSION, and GROWTH. Because ADHD doesn't just affect one part of your life—it touches everything.
                        </p>

                        <h2 className="text-3xl font-bold mt-12 mb-4 text-white">Our Promise</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Always free core tools</li>
                            <li>No data harvesting</li>
                            <li>Built BY neurodivergent people FOR neurodivergent people</li>
                            <li>Real solutions, not inspiration porn</li>
                        </ul>

                        <h2 className="text-3xl font-bold mt-12 mb-4 text-white">Get in Touch</h2>
                        <p>
                            WhatsApp: <a href="https://wa.me/447360277713" className="text-sor7ed-yellow hover:underline">+44 7360 277713</a><br />
                            Email: <a href="mailto:hello@sor7ed.com" className="text-sor7ed-yellow hover:underline">hello@sor7ed.com</a><br />
                            Company: SOR7ED LIMITED (Company #16398701)<br />
                            Location: London, UK
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
