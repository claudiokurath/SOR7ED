import { useState } from 'react'
interface SignupFormData {
    name: string
    email: string
    phone: string
    leadSource: string
}
const SignupForm = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        phone: '',
        leadSource: 'Direct'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)
        try {
            // Call backend API route (processed via Gemini)
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    leadSource: formData.leadSource,
                    signupDate: new Date().toISOString().split('T')[0],
                    status: 'Trial',
                    freeToolsUsed: 0,
                    creditsBalance: 0
                }),
            })
            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Welcome! Check your phone for a WhatsApp message from us.'
                })
                // Reset form
                setFormData({ name: '', email: '', phone: '', leadSource: 'Direct' })
            } else {
                throw new Error('Signup failed')
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Something went wrong. Please try again or text us directly at +44 7360 277713.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="bg-gray-900 border-2 border-gray-800 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-sor7ed-yellow">Start Your Free Trial</h2>
            <p className="text-gray-400 mb-8">Get 2 free tool requests. No credit card required.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none transition-colors"
                        placeholder="Your name"
                    />
                </div>
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none transition-colors"
                        placeholder="your@email.com"
                    />
                </div>
                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-300">
                        WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none transition-colors"
                        placeholder="+44 7XXX XXXXXX"
                    />
                </div>
                {/* Lead Source (hidden field with default value) */}
                <input type="hidden" name="leadSource" value={formData.leadSource} />
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sor7ed-yellow text-black font-bold py-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sor7ed-yellow/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? 'Setting up your account...' : 'Start Free Trial'}
                </button>
                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                            : 'bg-red-900/30 border-2 border-red-500 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}
            </form>
            <p className="text-sm text-gray-500 mt-6 text-center">
                By signing up, you agree to receive WhatsApp messages from SOR7ED. No spam, ever.
            </p>
        </div>
    )
}
export default SignupForm
