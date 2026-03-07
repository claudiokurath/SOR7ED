// Helper to call local APIs
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Save user signup to CRM via serverless function
 */
export async function saveSignup(data: {
    name: string
    email: string
    phone?: string
    template: string
    timezone?: string
    checkInHours?: string
}) {
    try {
        return await apiFetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error in saveSignup:', error);
        throw error;
    }
}

// Fetch published blog posts from Notion via serverless function
export async function getBlogPosts() {
    try {
        return await apiFetch('/api/blog');
    } catch (error) {
        console.error('Error in getBlogPosts:', error);
        return [];
    }
}

// Fetch live tools from Notion via serverless function
export async function getTools() {
    try {
        return await apiFetch('/api/tools');
    } catch (error) {
        console.error('Error in getTools:', error);
        return [];
    }
}
