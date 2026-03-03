import React, { useState } from 'react'
import { useVault } from '../context/VaultContext'

interface FavoriteButtonProps {
    itemId: string
    itemType: 'blog' | 'tool'
    className?: string
}

const FavoriteButton = ({ itemId, itemType, className = '' }: FavoriteButtonProps) => {
    const { isLoggedIn, isSaved, toggleSave } = useVault()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsProcessing(true)
        await toggleSave(itemId, itemType)
        setIsProcessing(false)
    }

    if (!isLoggedIn) return null

    const saved = isSaved(itemId)

    return (
        <button
            onClick={handleToggle}
            disabled={isProcessing}
            className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full border ${saved
                ? 'bg-sor7ed-yellow/20 border-sor7ed-yellow text-sor7ed-yellow shadow-[0_0_15px_rgba(255,230,0,0.1)]'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                } ${className}`}
        >
            <span className="text-sm">{saved ? '★' : '☆'}</span>
            <span className="text-[9px] font-fuel-decay uppercase tracking-[0.15em]">
                {isProcessing ? 'Updating...' : saved ? 'Added to Vault' : 'Add to Vault'}
            </span>
        </button>
    )
}

export default FavoriteButton
