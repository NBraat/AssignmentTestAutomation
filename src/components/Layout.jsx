// ═══════════════════════════════════════════════════════════════
// SIDEBAR NAVIGATIE CONFIG (per rol)
// ═══════════════════════════════════════════════════════════════

const NAV = {
    [ROLES.ADMIN]: [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
            label: 'Alle uren',
            path: '/hours',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        },
        {
            label: 'Gebruikersbeheer',
            path: '/users',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        },
    ],
    [ROLES.MANAGER]: [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
            label: 'Goedkeuren',
            path: '/approval',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        },
        {
            label: 'Rapportage',
            path: '/reports',
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
    ],
    [ROLES.GEBRUIKER]: [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
            label: 'Mijn uren',
            path: '/hours',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        },
    ],
};

// ═══════════════════════════════════════════════════════════════
// LAYOUT  —  sidebar + topbar wrapper
// ═══════════════════════════════════════════════════════════════

var Layout = ({ children, currentPath }) => {
    const { currentUser, logout } = useAuth();
    const navItems = NAV[currentUser?.role] || [];
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const pageTitle = navItems.find(n => n.path === currentPath)?.label || 'UrenPortaal';

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* ── Zijbalk ── */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-secondary flex flex-col shadow-2xl
          transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
            >
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-base leading-none">
                                Uren<span className="text-primary">Portaal</span>
                            </h1>
                            <p className="text-white/40 text-xs mt-0.5">Urenregistratie</p>
                        </div>
                    </div>
                </div>

                {/* Navigatie */}
                <nav className="flex-1 py-3 overflow-y-auto">
                    {navItems.map(item => {
                        const active = currentPath === item.path;
                        return (
                            <a
                                key={item.path}
                                href={`#${item.path}`}
                                onClick={() => setMobileOpen(false)}
                                className={`
                  flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all
                  ${active
                                        ? 'bg-primary text-secondary'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d={item.icon} />
                                </svg>
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Gebruikersfooter */}
                <div className="flex-shrink-0 px-4 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3 px-1">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                            {currentUser?.name?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{currentUser?.name}</p>
                            <RoleBadge role={currentUser?.role} />
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Uitloggen
                    </button>
                </div>
            </aside>

            {/* Mobiel overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Hoofdgebied ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
                    <button
                        className="lg:hidden text-gray-500 hover:text-secondary transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="text-base font-semibold text-secondary">{pageTitle}</h2>
                </header>

                {/* Pagina-inhoud */}
                <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
