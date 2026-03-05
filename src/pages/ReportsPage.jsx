// ═══════════════════════════════════════════════════════════════
// PAGINA: RAPPORTAGES (manager – placeholder)
// ═══════════════════════════════════════════════════════════════

var ReportsPage = () => {
    const allEntries = store.getEntries();
    const allUsers = store.getUsers() || DEFAULT_USERS;

    const approved = allEntries.filter(e => e.status === STATUS.GOEDGEKEURD);
    const totalHours = approved.reduce((sum, e) => sum + (e.uren || 0), 0);

    // Uren per medewerker
    const byUser = allUsers.map(u => ({
        name: u.name,
        role: u.role,
        hours: approved.filter(e => e.userId === u.id).reduce((s, e) => s + e.uren, 0),
        count: approved.filter(e => e.userId === u.id).length,
    })).filter(u => u.hours > 0).sort((a, b) => b.hours - a.hours);

    // Uren per project
    const projectMap = {};
    approved.forEach(e => {
        const key = e.projectcode;
        if (!projectMap[key]) projectMap[key] = { code: e.projectcode, naam: e.projectnaam, hours: 0, count: 0 };
        projectMap[key].hours += e.uren;
        projectMap[key].count += 1;
    });
    const byProject = Object.values(projectMap).sort((a, b) => b.hours - a.hours);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary">Rapportages</h2>
                    <p className="text-gray-500 mt-1 text-sm">Overzicht van goedgekeurde uren</p>
                </div>
            </div>

            {/* Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="text-sm font-semibold text-amber-800">Beperkte functionaliteit</p>
                    <p className="text-sm text-amber-700 mt-0.5">
                        Export (PDF/Excel) en geavanceerde filters zijn in deze versie niet geïmplementeerd.
                        Het onderstaande overzicht toont uitsluitend goedgekeurde uren.
                    </p>
                </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Goedgekeurde uren', value: `${totalHours}u`, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Registraties', value: approved.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                    { label: 'Actieve projecten', value: byProject.length, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
                ].map((s, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-secondary/10">
                                <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary tabular-nums">{s.value}</p>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Per medewerker */}
            {byUser.length > 0 && (
                <Card>
                    <CardHeader title="Uren per medewerker" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Medewerker</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registraties</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Totaal uren</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Verdeling</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {byUser.map((u, i) => (
                                    <tr key={i} className="hover:bg-gray-50/60">
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-gray-800">{u.name}</p>
                                            <RoleBadge role={u.role} />
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 tabular-nums">{u.count}</td>
                                        <td className="px-5 py-3 font-mono font-semibold text-secondary">{u.hours}u</td>
                                        <td className="px-5 py-3 hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[120px]">
                                                    <div
                                                        className="bg-primary h-1.5 rounded-full"
                                                        style={{ width: `${Math.round((u.hours / (totalHours || 1)) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 tabular-nums">
                                                    {Math.round((u.hours / (totalHours || 1)) * 100)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Per project */}
            {byProject.length > 0 && (
                <Card>
                    <CardHeader title="Uren per project" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registraties</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Totaal uren</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {byProject.map((p, i) => (
                                    <tr key={i} className="hover:bg-gray-50/60">
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-gray-800">{p.naam}</p>
                                            <p className="text-xs text-gray-400 font-mono">{p.code}</p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 tabular-nums">{p.count}</td>
                                        <td className="px-5 py-3 font-mono font-semibold text-secondary">{p.hours}u</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {approved.length === 0 && (
                <div className="py-16 text-center">
                    <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">Nog geen goedgekeurde uren om te rapporteren.</p>
                </div>
            )}
        </div>
    );
};
