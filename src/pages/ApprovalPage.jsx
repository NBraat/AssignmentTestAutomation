// ═══════════════════════════════════════════════════════════════
// PAGINA: GOEDKEURING (manager)
// ═══════════════════════════════════════════════════════════════

var ApprovalPage = () => {
    const { addToast } = useToast();
    const [rejectModal, setRejectModal] = React.useState(null); // entry id
    const [rejectNote, setRejectNote] = React.useState('');
    const [approveModal, setApproveModal] = React.useState(null); // entry id
    const [tab, setTab] = React.useState('pending'); // 'pending' | 'reviewed'

    const allEntries = store.getEntries();
    const allUsers = store.getUsers() || DEFAULT_USERS;

    const pending = allEntries.filter(e => e.status === STATUS.INGEDIEND)
        .sort((a, b) => (a.aangemaaktOp || '').localeCompare(b.aangemaaktOp || ''));
    const reviewed = allEntries.filter(e => [STATUS.GOEDGEKEURD, STATUS.AFGEKEURD].includes(e.status))
        .sort((a, b) => (b.aangemaaktOp || '').localeCompare(a.aangemaaktOp || ''));

    const getUserName = (id) => allUsers.find(u => u.id === id)?.name || '—';

    const handleApprove = (id) => {
        const all = store.getEntries();
        store.setEntries(all.map(e => e.id === id
            ? { ...e, status: STATUS.GOEDGEKEURD, reviewNote: '' }
            : e
        ));
        addToast('Registratie goedgekeurd.', 'success');
        setApproveModal(null);
    };

    const handleReject = () => {
        if (!rejectNote.trim()) {
            addToast('Voer een afkeuringsreden in.', 'error');
            return;
        }
        const all = store.getEntries();
        store.setEntries(all.map(e => e.id === rejectModal
            ? { ...e, status: STATUS.AFGEKEURD, reviewNote: rejectNote.trim() }
            : e
        ));
        addToast('Registratie afgekeurd.', 'success');
        setRejectModal(null);
        setRejectNote('');
    };

    const TableEmpty = ({ label }) => (
        <div className="px-5 py-12 text-center">
            <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );

    const EntryRow = ({ entry, actions }) => (
        <tr className="hover:bg-gray-50/60 transition-colors">
            <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{entry.datum}</td>
            <td className="px-5 py-3">
                <p className="font-medium text-gray-800">{entry.projectnaam}</p>
                <p className="text-xs text-gray-400 font-mono">{entry.projectcode}</p>
            </td>
            <td className="px-5 py-3 text-gray-500 hidden md:table-cell max-w-[160px]">
                <span className="block truncate">{entry.taakomschrijving || '—'}</span>
            </td>
            <td className="px-5 py-3 text-gray-600">{getUserName(entry.userId)}</td>
            <td className="px-5 py-3 font-mono text-gray-700 whitespace-nowrap">{entry.uren}u</td>
            <td className="px-5 py-3">{actions}</td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary">Goedkeuring</h2>
                <p className="text-gray-500 mt-1 text-sm">Beoordeel ingediende urenregistraties</p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2">
                <button
                    onClick={() => setTab('pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${tab === 'pending'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    In behandeling
                    {pending.length > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'pending' ? 'bg-white/20' : 'bg-orange-100 text-orange-700'}`}>
                            {pending.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab('reviewed')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${tab === 'reviewed'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    Beoordeeld
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'reviewed' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                        {reviewed.length}
                    </span>
                </button>
            </div>

            {/* ── Tabel: wacht op beoordeling */}
            {tab === 'pending' && (
                <Card>
                    <CardHeader title="Wacht op beoordeling" />
                    {pending.length === 0 ? (
                        <TableEmpty label="Geen ingediende registraties om te beoordelen." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Taak</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Medewerker</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uren</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actie</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {pending.map(entry => (
                                        <EntryRow
                                            key={entry.id}
                                            entry={entry}
                                            actions={
                                                <div className="flex items-center gap-2">
                                                    <Button variant="success" size="sm" onClick={() => setApproveModal(entry.id)}>
                                                        Goedkeuren
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => { setRejectModal(entry.id); setRejectNote(''); }}>
                                                        Afkeuren
                                                    </Button>
                                                </div>
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* ── Tabel: beoordeeld */}
            {tab === 'reviewed' && (
                <Card>
                    <CardHeader title="Eerder beoordeeld" />
                    {reviewed.length === 0 ? (
                        <TableEmpty label="Nog geen beoordeelde registraties." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Taak</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Medewerker</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uren</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uitkomst</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reviewed.map(entry => (
                                        <EntryRow
                                            key={entry.id}
                                            entry={entry}
                                            actions={
                                                <div>
                                                    <Badge status={entry.status} />
                                                    {entry.status === STATUS.AFGEKEURD && entry.reviewNote && (
                                                        <p className="text-xs text-red-500 italic mt-1">"{entry.reviewNote}"</p>
                                                    )}
                                                </div>
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* ── Modal: goedkeuren */}
            <ConfirmModal
                open={!!approveModal}
                title="Registratie goedkeuren"
                message="Weet je zeker dat je deze urenregistratie wilt goedkeuren?"
                confirmLabel="Goedkeuren"
                confirmVariant="success"
                onConfirm={() => handleApprove(approveModal)}
                onCancel={() => setApproveModal(null)}
            />

            {/* ── Modal: afkeuren */}
            <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Registratie afkeuren">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Geef een reden op voor de afkeuring. De medewerker kan zijn registratie daarna aanpassen en opnieuw indienen.
                    </p>
                    <Textarea
                        label="Afkeuringsreden *"
                        placeholder="bijv. Uren kloppen niet met de projectplanning…"
                        rows={3}
                        value={rejectNote}
                        onChange={e => setRejectNote(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setRejectModal(null)}>Annuleren</Button>
                        <Button variant="danger" onClick={handleReject}>Afkeuren</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
