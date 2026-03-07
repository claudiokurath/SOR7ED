import { useState, useEffect } from 'react'

export function useVaultSession() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('sor7ed_vault_token')
        if (!token) {
            setIsLoggedIn(false)
            setIsLoading(false)
            return
        }

        // Quick client-side expiry check (server will also verify)
        try {
            const decoded = atob(token)
            const parts = decoded.split(':')
            const expiresAt = parseInt(parts[1])
            if (Date.now() > expiresAt) {
                localStorage.removeItem('sor7ed_vault_token')
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true)
            }
        } catch {
            setIsLoggedIn(false)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { isLoggedIn, isLoading }
}
