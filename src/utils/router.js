// ═══════════════════════════════════════════════════════════════
// HASH-GEBASEERDE ROUTER
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

const getPath = () => {
    const h = window.location.hash;
    return h ? h.slice(1) : '/login';
};

export const navigate = (path) => {
    window.location.hash = path;
};

export const useRoute = () => {
    const [path, setPath] = useState(getPath);
    useEffect(() => {
        const handler = () => setPath(getPath());
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);
    return path;
};
