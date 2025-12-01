import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        // Check active session and subscribe to auth changes
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const intent = localStorage.getItem('auth_intent');
                if (intent === 'signin') {
                    // Check if user is new (created within the last minute)
                    const createdAt = new Date(session.user.created_at).getTime();
                    const now = new Date().getTime();
                    const isNewUser = (now - createdAt) < 60000; // 60 seconds threshold

                    if (isNewUser) {
                        await supabase.auth.signOut();
                        setCurrentUser(null);
                        setAuthError("Account does not exist. Please use Sign Up to create an account.");
                        localStorage.removeItem('auth_intent');
                        setLoading(false);
                        return;
                    }
                }
                localStorage.removeItem('auth_intent');
            }
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, name) => {
        setAuthError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign up');
            }

            // If backend returns a session, set it manually
            if (data.session) {
                const { error } = await supabase.auth.setSession(data.session);
                if (error) throw error;
            }

            return { success: true, data };
        } catch (error) {
            setAuthError(error.message);
            return { success: false, error: error.message };
        }
    };

    const signIn = async (email, password) => {
        setAuthError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign in');
            }

            if (data.session) {
                const { error } = await supabase.auth.setSession(data.session);
                if (error) throw error;
            }

            return { success: true, data };
        } catch (error) {
            setAuthError(error.message);
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const clearError = React.useCallback(() => {
        setAuthError('');
    }, []);

    const resetPassword = async (email) => {
        setAuthError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            return { success: true, data };
        } catch (error) {
            setAuthError(error.message);
            return { success: false, message: error.message };
        }
    };

    const signInWithGoogle = async (intent) => {
        setAuthError('');
        try {
            if (intent) {
                localStorage.setItem('auth_intent', intent);
            }

            const response = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate Google login');
            }

            // Redirect to the URL returned by the backend
            if (data.url) {
                window.location.href = data.url;
            }

            return { success: true };
        } catch (error) {
            setAuthError(error.message);
            return { success: false, error: error.message };
        }
    };

    const value = {
        currentUser,
        signUp,
        signIn,
        signOut,
        resetPassword,
        signInWithGoogle,
        authError,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
