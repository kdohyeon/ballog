'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: string | null;
    login: (id: string, pw: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Init auth from local storage
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (id: string, pw: string) => {
        if (id === 'admin' && pw === 'admin') {
            setUser(id);
            localStorage.setItem('admin_user', id);
            router.push('/');
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('admin_user');
        router.push('/login');
    };

    const isAuthenticated = !!user;

    // Protect routes
    useEffect(() => {
        const isLoginPage = pathname === '/login';
        if (!isAuthenticated && !isLoginPage) {
            // Allow a brief moment for hydration, but ideally middleware is better.
            // For this simple app, we check if user is null after mount.
            const storedUser = localStorage.getItem('admin_user');
            if (!storedUser) {
                router.push('/login');
            }
        }
    }, [isAuthenticated, pathname, router]);


    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
