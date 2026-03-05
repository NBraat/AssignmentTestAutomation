// ═══════════════════════════════════════════════════════════════
// PAGINA: URENREGISTRATIE
// ═══════════════════════════════════════════════════════════════

var HoursPage = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const isAdmin = currentUser.role === ROLES.ADMIN;

    const emptyForm = { datum: '', projectcode: '', projectnaam: '', taakomschrijving: '', uren: '', notitie: '' };
    const [form, setForm] = React.useState(emptyForm);
    const [errors, setErrors] = React.useState({});
    const [editId, setEditId] = React.useState(null);
    const [submitModal, setSubmitModal] = React.useState(false);
    const [deleteModal, setDeleteModal] = React.useState(null);
    const [filterStatus, setFilterStatus] = React.useState('all');
    const [search, setSearch] = React.useState('');

    const refresh = () => { };  // entries lezen we altijd live uit store

    // ── Auto-bewerken via dashboard shortcut
    React.useEffect(() => {
        const pendingId = store.getPendingEdit();
        if (pendingId) {
            store.clearPendingEdit();
            const all = store.getEntries();
            const entry = all.find(e => e.id === pendingId);
            if (entry) {
                setEditId(entry.id);
                setForm({
                    datum: entry.datum,
                    projectcode: entry.projectcode,
                    projectnaam: entry.projectnaam,
                    taakomschrijving: entry.taakomschrijving || '',
                    uren: String(entry.uren),
                    notitie: entry.notitie || '',
                });
            }
        }
    }, []);

    const allEntries = store.getEntries();
    const entries = isAdmin
        ? allEntries
        : allEntries.filter(e => e.userId === currentUser.id);

    // ── Permissies
    const canEdit = (entry) =>
        [STATUS.CONCEPT, STATUS.INGEDIEND, STATUS.AFGEKEURD].includes(entry.status);

    const canDelete = (entry) => entry.status === STATUS.CONCEPT;
    const canSubmit = (entry) => entry.status === STATUS.CONCEPT;

    // ── Validatie
    const validate = () => {
        const errs = {};
        if (!form.datum) errs.datum = 'Verplicht veld';
        if (!form.projectcode.trim()) errs.projectcode = 'Verplicht veld';
        if (!form.projectnaam.trim()) errs.projectnaam = 'Verplicht veld';
        if (!form.uren || isNaN(parseFloat(form.uren)) || parseFloat(form.uren) <= 0)
            errs.uren = 'Voer een geldig aantal uren in';
        else if (parseFloat(form.uren) >= 25)
            errs.uren = 'Maximaal 24,9 uur per dag';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Formulier handlers
    const handleChange = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleEdit = (entry) => {
        setEditId(entry.id);
        setForm({
            datum: entry.datum,
            projectcode: entry.projectcode,
            projectnaam: entry.projectnaam,
            taakomschrijving: entry.taakomschrijving || '',
            uren: String(entry.uren),
            notitie: entry.notitie || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => { setEditId(null); setForm(emptyForm); setErrors({}); };

    const handleSave = (statusOverride) => {
        const status = statusOverride || (editId
            ? allEntries.find(e => e.id === editId)?.status || STATUS.CONCEPT
            : STATUS.CONCEPT
        );

        if (!validate()) return false;

        const all = store.getEntries();

        if (editId) {
            store.setEntries(all.map(e => e.id === editId
                ? { ...e, ...form, uren: parseFloat(form.uren), status, reviewNote: '' }
                : e
            ));
            addToast(statusOverride === STATUS.INGEDIEND ? 'Uren ingediend!' : 'Registratie opgeslagen.', 'success');
        } else {
            const entry = {
                id: Date.now().toString(),
                userId: currentUser.id,
                datum: form.datum,
                projectcode: form.projectcode,
                projectnaam: form.projectnaam,
                taakomschrijving: form.taakomschrijving,
                uren: parseFloat(form.uren),
                notitie: form.notitie,
                status: status,
                reviewNote: '',
                aangemaaktOp: new Date().toISOString(),
            };
            store.setEntries([...all, entry]);
            addToast(statusOverride === STATUS.INGEDIEND ? 'Uren ingediend!' : 'Registratie opgeslagen als concept.', 'success');
        }

        setEditId(null);
        setForm(emptyForm);
        setErrors({});
        return true;
    };

    const handleSubmitDirect = () => {
        const ok = handleSave(STATUS.INGEDIEND);
        if (ok) setSubmitModal(false);
    };

    const handleDelete = (id) => {
        const all = store.getEntries();
        store.setEntries(all.filter(e => e.id !== id));
        addToast('Registratie verwijderd.', 'success');
        setDeleteModal(null);
        if (editId === id) handleCancel();
    };

    // ── Filteren
    const filteredEntries = entries
        .filter(e => filterStatus === 'all' || e.status === filterStatus)
        .filter(e => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                e.projectnaam?.toLowerCase().includes(q) ||
                e.projectcode?.toLowerCase().includes(q) ||
                e.taakomschrijving?.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => (b.aangemaaktOp || '').localeCompare(a.aangemaaktOp || ''));

    const statusOptions = [
        { value: 'all', label: 'Alle statussen' },
        { value: STATUS.CONCEPT, label: 'Concept' },
        { value: STATUS.INGEDIEND, label: 'Ingediend' },
        { value: STATUS.GOEDGEKEURD, label: 'Goedgekeurd' },
        { value: STATUS.AFGEKEURD, label: 'Afgekeurd' },
    ];

    // ── Snel indienen vanuit overzicht (zonder bewerken)
    const handleQuickSubmit = (entry) => {
        const all = store.getEntries();
        store.setEntries(all.map(e => e.id === entry.id
            ? { ...e, status: STATUS.INGEDIEND }
            : e
        ));
        addToast('Uren ingediend!', 'success');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary">Urenregistratie</h2>
                <p className="text-gray-500 mt-1 text-sm">
                    {isAdmin ? 'Overzicht van alle registraties' : 'Registreer en beheer je uren'}
                </p>
            </div>

            {/* ── Formulier (niet voor read-only admin view) */}
            {!isAdmin && (
                <Card>
                    <CardHeader title={editId ? 'Registratie bewerken' : 'Nieuwe registratie'} />
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Datum *"
                                type="date"
                                value={form.datum}
                                error={errors.datum}
                                onChange={handleChange('datum')}
                            />
                            <Input
                                label="Uren *"
                                type="number"
                                min="0.5"
                                max="24.9"
                                step="0.5"
                                placeholder="8"
                                value={form.uren}
                                error={errors.uren}
                                onChange={handleChange('uren')}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Projectcode *"
                                placeholder="bijv. PROJ-001"
                                value={form.projectcode}
                                error={errors.projectcode}
                                onChange={handleChange('projectcode')}
                            />
                            <Input
                                label="Projectnaam *"
                                placeholder="bijv. Website redesign"
                                value={form.projectnaam}
                                error={errors.projectnaam}
                                onChange={handleChange('projectnaam')}
                            />
                        </div>
                        <Input
                            label="Taakomschrijving"
                            placeholder="Wat heb je gedaan?"
                            value={form.taakomschrijving}
                            onChange={handleChange('taakomschrijving')}
                        />
                        <Textarea
                            label="Notitie"
                            placeholder="Optionele toelichting…"
                            rows={2}
                            value={form.notitie}
                            onChange={handleChange('notitie')}
                        />
                        <div className="flex gap-3 flex-wrap pt-1">
                            <Button variant="secondary" onClick={() => handleSave()}>
                                {editId ? 'Opslaan' : 'Opslaan als concept'}
                            </Button>
                            <Button variant="primary" onClick={() => { if (validate()) setSubmitModal(true); }}>
                                {editId ? 'Opslaan & indienen' : 'Direct indienen'}
                            </Button>
                            <Button variant="ghost" onClick={handleCancel}>
                                {editId ? 'Annuleren' : 'Wissen'}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Overzichtstabel */}
            <Card>
                <CardHeader title={isAdmin ? 'Alle registraties' : 'Mijn registraties'} />

                {/* Filters */}
                <div className="px-5 pt-4 pb-2 flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[180px]">
                        <input
                            type="text"
                            placeholder="Zoeken op project of taak…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                    >
                        {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {filteredEntries.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                        <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm text-gray-400">Geen registraties gevonden.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Taak</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uren</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    {!isAdmin && <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acties</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEntries.map(entry => (
                                    <tr key={entry.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{entry.datum}</td>
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-gray-800">{entry.projectnaam}</p>
                                            <p className="text-xs text-gray-400 font-mono">{entry.projectcode}</p>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 hidden sm:table-cell max-w-[200px]">
                                            <span className="block truncate">{entry.taakomschrijving || '—'}</span>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-gray-700 whitespace-nowrap">{entry.uren}u</td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-col gap-1">
                                                <Badge status={entry.status} />
                                                {entry.status === STATUS.AFGEKEURD && entry.reviewNote && (
                                                    <p className="text-xs text-red-500 italic max-w-[180px]">"{entry.reviewNote}"</p>
                                                )}
                                            </div>
                                        </td>
                                        {!isAdmin && (
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {canEdit(entry) && (
                                                        <button
                                                            onClick={() => handleEdit(entry)}
                                                            className="text-secondary hover:text-primary transition-colors p-1 rounded"
                                                            title="Bewerken"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {canSubmit(entry) && (
                                                        <button
                                                            onClick={() => handleQuickSubmit(entry)}
                                                            className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded"
                                                            title="Indienen"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {canDelete(entry) && (
                                                        <button
                                                            onClick={() => setDeleteModal(entry.id)}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                                                            title="Verwijderen"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* ── Modals */}
            <ConfirmModal
                open={submitModal}
                title="Uren indienen"
                message={editId ? 'Wil je deze registratie opslaan en indienen ter goedkeuring?' : 'Wil je deze registratie direct indienen ter goedkeuring?'}
                confirmLabel="Indienen"
                confirmVariant="primary"
                onConfirm={handleSubmitDirect}
                onCancel={() => setSubmitModal(false)}
            />
            <ConfirmModal
                open={!!deleteModal}
                title="Registratie verwijderen"
                message="Weet je zeker dat je deze registratie wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
                confirmLabel="Verwijderen"
                confirmVariant="danger"
                onConfirm={() => handleDelete(deleteModal)}
                onCancel={() => setDeleteModal(null)}
            />
        </div>
    );
};
