import SignupForm from '../components/SignupForm'

const Signup = () => {
    return (
        <div className="min-h-screen bg-black py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Get <span className="text-sor7ed-yellow">2 Free</span> Tool Requests
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                        Try our ADHD-friendly concierge service. No credit card. No commitment.
                    </p>
                </div>

                {/* What You Get Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold mb-2 text-sor7ed-yellow">Instant Setup</h3>
                        <p className="text-gray-400">Get a welcome message on WhatsApp within 60 seconds</p>
                    </div>
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">🎁</div>
                        <h3 className="text-xl font-bold mb-2 text-sor7ed-yellow">2 Free Tools</h3>
                        <p className="text-gray-400">Try any tools from our library, completely free</p>
                    </div>
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2 text-sor7ed-yellow">WhatsApp Only</h3>
                        <p className="text-gray-400">No apps. No logins. Just text us.</p>
                    </div>
                </div>

                {/* Form */}
                <SignupForm />

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Quick Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 text-sor7ed-yellow">What happens after I sign up?</h3>
                            <p className="text-gray-400">You'll get a WhatsApp message within 60 seconds with instructions on how to request your first tool.</p>
                        </div>
                        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 text-sor7ed-yellow">Do I need to pay?</h3>
                            <p className="text-gray-400">No. Your first 2 tool requests are completely free. After that, you can buy credits if you want to continue.</p>
                        </div>
                        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2 text-sor7ed-yellow">Can I cancel anytime?</h3>
                            <p className="text-gray-400">There's nothing to cancel. Just stop texting us. No subscriptions, ever.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
