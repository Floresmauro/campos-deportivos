const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Auth token from Supabase would go here if needed
    // const { data: { session } } = await supabase.auth.getSession();
    // if (session) {
    //   headers['Authorization'] = `Bearer ${session.access_token}`;
    // }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}
