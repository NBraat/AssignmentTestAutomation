// ═══════════════════════════════════════════════════════════════
// APP — routing + toegangscontrole
// ═══════════════════════════════════════════════════════════════

var ROUTE_ACCESS = {
    '/dashboard': [ROLES.ADMIN, ROLES.MANAGER, ROLES.GEBRUIKER],
    '/hours': [ROLES.ADMIN, ROLES.GEBRUIKER],
    '/approval': [ROLES.MANAGER],
    '/reports': [ROLES.MANAGER],
    '/users': [ROLES.ADMIN],
};

var App = () => {
    const path = useRoute();
    const { currentUser, refreshSession } = useAuth();

    // Reset-route: herstel standaard data en stuur naar login
    React.useEffect(() => {
        if (path === '/reset') {
            store.reset();
            refreshSession();
            navigate('/login');
        }
    }, [path]);

    if (path === '/reset') return null;

    // Niet ingelogd → login pagina
    if (!currentUser) {
        if (path !== '/login') navigate('/login');
        return <LoginPage />;
    }

    // Al ingelogd → weg van login
    if (path === '/login') {
        navigate('/dashboard');
        return null;
    }

    // Toegangscontrole op basis van rol
    const allowed = ROUTE_ACCESS[path];
    if (allowed && !allowed.includes(currentUser.role)) {
        navigate('/dashboard');
        return null;
    }

    const renderPage = () => {
        switch (path) {
            case '/dashboard': return <DashboardPage />;
            case '/hours': return <HoursPage />;
            case '/approval': return <ApprovalPage />;
            case '/reports': return <ReportsPage />;
            case '/users': return <AdminUsersPage />;
            default: return <DashboardPage />;
        }
    };

    return <Layout currentPath={path}>{renderPage()}</Layout>;
};
