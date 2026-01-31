"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'manager' | 'employee';
    assigned_stadium?: string | null;
    avatar_url?: string | null;
    dni?: string | null;
    obra_social?: string | null;
    birth_date?: string | null;
    start_date?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    phone?: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isManager: boolean;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if user is logged in on mount
    useEffect(() => {
        let mounted = true;

        // Listen for auth changes - INITIAL_SESSION will fire immediately
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);

            try {
                if (session && mounted) {
                    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                        await fetchUserProfile(session.user.id, session.user.email!);
                    }
                } else if (mounted) {
                    if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error in auth state change:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        });

        // Safety fallback: if no event fires within 5 seconds, clear loading
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth initialization timed out, clearing loading state.');
                setLoading(false);
            }
        }, 5000);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            setUser({
                id: userId,
                email: email,
                full_name: profile.full_name,
                role: profile.role,
                assigned_stadium: profile.assigned_stadium_id,
                avatar_url: profile.avatar_url,
                dni: profile.dni,
                obra_social: profile.obra_social,
                birth_date: profile.birth_date,
                start_date: profile.start_date,
                emergency_contact_name: profile.emergency_contact_name,
                emergency_contact_phone: profile.emergency_contact_phone,
                phone: profile.phone
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                await fetchUserProfile(data.user.id, data.user.email!);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    avatar_url: data.avatar_url,
                    emergency_contact_name: data.emergency_contact_name,
                    emergency_contact_phone: data.emergency_contact_phone,
                    obra_social: data.obra_social,
                    dni: data.dni
                })
                .eq('id', user.id);

            if (error) throw error;

            // Refresh local user state
            await fetchUserProfile(user.id, user.email);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
