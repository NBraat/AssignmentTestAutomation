// ═══════════════════════════════════════════════════════════════
// HASH-GEBASEERDE ROUTER
// Geen JSX — werkt ook via file://
// Afhankelijk van: React (window.React)
// ═══════════════════════════════════════════════════════════════

var getPath = () => {
    const h = window.location.hash;
    return h ? h.slice(1) : '/login';
};

var navigate = (path) => {
    window.location.hash = path;
};

// React hook — mag gebruikt worden in .jsx bestanden
var useRoute = () => {
    const [path, setPath] = React.useState(getPath);
    React.useEffect(() => {
        const handler = () => setPath(getPath());
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
    }, []);
    return path;
};
