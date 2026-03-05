// ═══════════════════════════════════════════════════════════════
// PAGINA: DASHBOARD
// ═══════════════════════════════════════════════════════════════

var DashboardPage = () => {
    const { currentUser } = useAuth();
    const entries = store.getEntries();
    const users = store.getUsers() || DEFAULT_USERS;
    const myEntries = entries.filter(e => e.userId === currentUser.id);

    const statsByRole = {
        [ROLES.ADMIN]: [
            {
                label: 'Totaal gebruikers',
                value: users.length,
                color: 'text-purple-600 bg-purple-50',
                icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            },
            {
                label: 'In behandeling',
                value: entries.filter(e => e.status === STATUS.INGEDIEND).length,
                color: 'text-blue-600 bg-blue-50',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            },
            {
                label: 'Goedgekeurd (totaal)',
                value: entries.filter(e => e.status === STATUS.GOEDGEKEURD).length,
                color: 'text-green-600 bg-green-50',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Mijn concepten',
                value: myEntries.filter(e => e.status === STATUS.CONCEPT).length,
                color: 'text-amber-600 bg-amber-50',
                icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            },
        ],
        [ROLES.MANAGER]: [
            {
                label: 'Wacht op goedkeuring',
                value: entries.filter(e => e.status === STATUS.INGEDIEND).length,
                color: 'text-orange-600 bg-orange-50',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Goedgekeurd',
                value: entries.filter(e => e.status === STATUS.GOEDGEKEURD).length,
                color: 'text-green-600 bg-green-50',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Afgekeurd',
                value: entries.filter(e => e.status === STATUS.AFGEKEURD).length,
                color: 'text-red-600 bg-red-50',
                icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Totaal registraties',
                value: entries.length,
                color: 'text-blue-600 bg-blue-50',
                icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            },
        ],
        [ROLES.GEBRUIKER]: [
            {
                label: 'Concepten',
                value: myEntries.filter(e => e.status === STATUS.CONCEPT).length,
                color: 'text-gray-600 bg-gray-50',
                icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            },
            {
                label: 'Ingediend',
                value: myEntries.filter(e => e.status === STATUS.INGEDIEND).length,
                color: 'text-blue-600 bg-blue-50',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Goedgekeurd',
                value: myEntries.filter(e => e.status === STATUS.GOEDGEKEURD).length,
                color: 'text-green-600 bg-green-50',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
                label: 'Afgekeurd',
                value: myEntries.filter(e => e.status === STATUS.AFGEKEURD).length,
                color: 'text-red-600 bg-red-50',
                icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            },
        ],
    };

    const stats = statsByRole[currentUser.role] || [];
    const recentEntries = (currentUser.role === ROLES.MANAGER ? entries : myEntries)
        .slice()
        .sort((a, b) => (b.aangemaaktOp || '').localeCompare(a.aangemaaktOp || ''))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Welkomstbericht */}
            <div>
                <h2 className="text-2xl font-bold text-secondary">
                    Welkom terug, {currentUser.name.split(' ')[0]}! 👋
                </h2>
                <p className="text-gray-500 mt-1 text-sm">Hier is een overzicht van de huidige status.</p>
            </div>

            {/* Statistieken */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-5">
                        <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-secondary tabular-nums">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Recente activiteit */}
            <Card>
                <CardHeader
                    title="Recente activiteit"
                    action={
                        currentUser.role !== ROLES.MANAGER && (
                            <Button variant="secondary" size="sm" onClick={() => navigate('/hours')}>
                                + Nieuwe registratie
                            </Button>
                        )
                    }
                />
                {recentEntries.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                        <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-400">Nog geen registraties gevonden.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {recentEntries.map(entry => {
                            const allUsers = store.getUsers() || DEFAULT_USERS;
                            const user = allUsers.find(u => u.id === entry.userId);
                            return (
                                <div key={entry.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-800 truncate">{entry.projectnaam}</p>
                                            <span className="text-xs font-mono text-gray-400 flex-shrink-0">{entry.projectcode}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {entry.datum} · {entry.uren}u
                                            {currentUser.role === ROLES.MANAGER && user && ` · ${user.name}`}
                                            {entry.taakomschrijving && ` · ${entry.taakomschrijving.slice(0, 50)}${entry.taakomschrijving.length > 50 ? '…' : ''}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {entry.status === STATUS.CONCEPT && entry.userId === currentUser.id && (
                                            <button
                                                onClick={() => { store.setPendingEdit(entry.id); navigate('/hours'); }}
                                                className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
                                                title="Bewerken"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                        <Badge status={entry.status} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};
