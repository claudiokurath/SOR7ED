import { useState, useEffect } from 'react'

export function useNotionData<T>(endpoint: string, fallback: T[] = []): {
    data: T[]
    loading: boolean
    error: string | null
} {
    const [data, setData] = useState<T[]>(fallback)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error(`API ${res.status}`)
                return res.json()
            })
            .then((json) => {
                if (!cancelled) setData(Array.isArray(json) ? json : fallback)
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error(`Fetch error for ${endpoint}:`, err.message)
                    setError(err.message)
                }
            })

            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [endpoint])

    return { data, loading, error }
}
