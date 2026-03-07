import { useState } from 'react'

interface SignupModalProps {
    isOpen: boolean
    onClose: () => void
    template: string
    whatsappUrl: string
}

const SignupModal = ({ isOpen, onClose, template, whatsappUrl }: SignupModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    leadSource: 'Tool: ' + template,
                    signupDate: new Date().toISOString().split('T')[0],
                    status: 'Trial',
                    freeToolsUsed: 0,
                    creditsBalance: 2
                })
            })

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Welcome! Opening WhatsApp...'
                })
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank')
                    onClose()
                }, 1500)
            } else {
                throw new Error('Signup failed')
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Something went wrong. Please try texting us directly.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl"
                >
                    ×
                </button>

                <h3 className="text-2xl font-bold text-white mb-2">
                    Deploy to WhatsApp
                </h3>
                <p className="text-zinc-500 text-sm mb-6">
                    Get <span className="text-sor7ed-yellow">{template}</span> sent to your phone
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sor7ed-yellow focus:outline-none"
                            placeholder="+44 7XXX XXXXXX"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-sor7ed-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                    >
                        {isSubmitting ? 'Deploying...' : 'Deploy to Phone'}
                    </button>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                : 'bg-red-500/20 border border-red-500/50 text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </form>

                <p className="text-xs text-zinc-600 mt-4 text-center">
                    By signing up, you agree to receive WhatsApp messages from SOR7ED.
                </p>
            </div>
        </div>
    )
}

export default SignupModal
