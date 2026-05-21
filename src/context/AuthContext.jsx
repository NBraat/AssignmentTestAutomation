// ═══════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════

import React, { createContext, useState, useContext } from 'react';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';
import { SESSION_COOKIE } from '../constants';
import { navigate } from '../utils/router';
import store from '../data/store';
import { DEFAULT_USERS } from '../data/defaults';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => getCookie(SESSION_COOKIE));

    const login = (email, password) => {
        let users = store.getUsers() || DEFAULT_USERS;
        // Als opgeslagen gebruikers geen e-mail hebben (oud formaat), vervang ze
        if (users.some(u => !u.email)) {
            store.setUsers(DEFAULT_USERS);
            users = DEFAULT_USERS;
        }
        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) throw new Error('Ongeldig e-mailadres of wachtwoord.');
        const { password: _, ...safeUser } = user;
        setCookie(SESSION_COOKIE, safeUser, 1);
        setCurrentUser(safeUser);
        return safeUser;
    };

    const logout = () => {
        deleteCookie(SESSION_COOKIE);
        setCurrentUser(null);
        navigate('/login');
    };

    const refreshSession = () => {
        const stored = getCookie(SESSION_COOKIE);
        setCurrentUser(stored);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
