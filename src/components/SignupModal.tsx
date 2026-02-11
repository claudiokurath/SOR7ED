import { useState } from 'react'
import { saveSignup } from '../utils/notion'

interface SignupModalProps {
    isOpen: boolean
    onClose: () => void
    template: string
    whatsappUrl: string
}

export default function SignupModal({ isOpen, onClose, template, whatsappUrl }: SignupModalProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Save to Notion CRM
            await saveSignup({ name, email, phone, template })

            // Redirect to WhatsApp
            window.location.href = whatsappUrl
        } catch (err) {
            setError('Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-black border-2 border-sor7ed-yellow rounded-xl p-8 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                >
                    ×
                </button>

                <h2 className="text-3xl font-bold mb-2 text-sor7ed-yellow">Get Your Free Template</h2>
                <p className="text-gray-400 mb-6">Quick signup to unlock: <strong className="text-white">{template}</strong></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-sor7ed-gray border border-sor7ed-gray-light rounded-lg focus:border-sor7ed-yellow focus:outline-none text-white"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-sor7ed-gray border border-sor7ed-gray-light rounded-lg focus:border-sor7ed-yellow focus:outline-none text-white"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone (optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-sor7ed-gray border border-sor7ed-gray-light rounded-lg focus:border-sor7ed-yellow focus:outline-none text-white"
                            placeholder="+44..."
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sor7ed-yellow text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : '📱 Get Template on WhatsApp'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        We'll never spam. Unsubscribe anytime.
                    </p>
                </form>
            </div>
        </div>
    )
}
