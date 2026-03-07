import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface User {
    name: string
    email: string
    savedItems: string[]
}

interface VaultContextType {
    isLoggedIn: boolean
    isLoading: boolean
    user: User | null
    refreshVault: () => Promise<void>
    isSaved: (itemId: string) => boolean
    toggleSave: (itemId: string, itemType: 'blog' | 'tool') => Promise<void>
    logout: () => void
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const fetchProfile = useCallback(async (token: string) => {
        try {
            const res = await fetch(`/api/vault/content?token=${token}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                setIsLoggedIn(true)
            } else {
                localStorage.removeItem('sor7ed_vault_token')
                setIsLoggedIn(false)
                setUser(null)
            }
        } catch (err) {
            console.error('Vault profile fetch failed:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('sor7ed_vault_token')
        if (token) {
            fetchProfile(token)
        } else {
            setIsLoading(false)
        }
    }, [fetchProfile])

    const refreshVault = async () => {
        const token = localStorage.getItem('sor7ed_vault_token')
        if (token) await fetchProfile(token)
    }

    const isSaved = (itemId: string) => {
        return user?.savedItems?.includes(itemId) || false
    }

    const toggleSave = async (itemId: string, itemType: 'blog' | 'tool') => {
        if (!isLoggedIn) {
            window.location.href = '/vault'
            return
        }

        const token = localStorage.getItem('sor7ed_vault_token')
        const currentlySaved = isSaved(itemId)

        // Optimistic UI update
        const previousSavedItems = user?.savedItems || []
        const newSavedItems = currentlySaved
            ? previousSavedItems.filter(id => id !== itemId)
            : [...previousSavedItems, itemId]

        if (user) setUser({ ...user, savedItems: newSavedItems })

        try {
            const res = await fetch('/api/vault/save-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId,
                    itemType,
                    action: currentlySaved ? 'remove' : 'add'
                })
            })

            if (!res.ok) {
                // Revert on failure
                if (user) setUser({ ...user, savedItems: previousSavedItems })
            }
        } catch (err) {
            console.error('Save toggle failed:', err)
            if (user) setUser({ ...user, savedItems: previousSavedItems })
        }
    }

    const logout = () => {
        localStorage.removeItem('sor7ed_vault_token')
        setIsLoggedIn(false)
        setUser(null)
    }

    return (
        <VaultContext.Provider value={{ isLoggedIn, isLoading, user, refreshVault, isSaved, toggleSave, logout }}>
            {children}
        </VaultContext.Provider>
    )
}

export const useVault = () => {
    const context = useContext(VaultContext)
    if (context === undefined) {
        throw new Error('useVault must be used within a VaultProvider')
    }
    return context
}
