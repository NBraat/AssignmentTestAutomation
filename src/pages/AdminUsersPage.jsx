// ═══════════════════════════════════════════════════════════════
// PAGINA: GEBRUIKERSBEHEER (admin)
// ═══════════════════════════════════════════════════════════════

var AdminUsersPage = () => {
    const { currentUser, logout } = useAuth();
    const { addToast } = useToast();

    const emptyForm = { name: '', email: '', password: '', role: ROLES.GEBRUIKER };
    const [form, setForm] = React.useState(emptyForm);
    const [deleteModal, setDeleteModal] = React.useState(null);
    const [creating, setCreating] = React.useState(false);

    const users = store.getUsers() || DEFAULT_USERS;

    const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleCreate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            addToast('Vul alle velden in.', 'error');
            return;
        }
        if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) {
            addToast('Dit e-mailadres is al in gebruik.', 'error');
            return;
        }
        const newUser = {
            id: Date.now().toString(),
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: form.role,
        };
        store.setUsers([...users, newUser]);
        addToast(`Gebruiker "${newUser.name}" aangemaakt.`, 'success');
        setForm(emptyForm);
        setCreating(false);
    };

    const handleDelete = (id) => {
        if (id === currentUser.id) {
            addToast('Je kunt je eigen account niet verwijderen.', 'error');
            setDeleteModal(null);
            return;
        }
        const updatedUsers = users.filter(u => u.id !== id);
        const updatedEntries = entries.filter(e => e.userId !== id);
        store.setUsers(updatedUsers);
        store.setEntries(updatedEntries);
        addToast('Gebruiker verwijderd.', 'success');
        setDeleteModal(null);
    };

    const roleOptions = [
        { value: ROLES.GEBRUIKER, label: 'Gebruiker' },
        { value: ROLES.MANAGER, label: 'Manager' },
        { value: ROLES.ADMIN, label: 'Admin' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary">Gebruikersbeheer</h2>
                    <p className="text-gray-500 mt-1 text-sm">Beheer de accounts in het systeem</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setCreating(c => !c)}>
                    {creating ? 'Annuleren' : '+ Gebruiker toevoegen'}
                </Button>
            </div>

            {/* ── Formulier nieuwe gebruiker */}
            {creating && (
                <Card>
                    <CardHeader title="Nieuwe gebruiker aanmaken" />
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Volledige naam *"
                                placeholder="Jan de Vries"
                                value={form.name}
                                onChange={handleChange('name')}
                            />
                            <Input
                                label="E-mailadres *"
                                type="email"
                                placeholder="jan@voorbeeld.nl"
                                value={form.email}
                                onChange={handleChange('email')}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Wachtwoord *"
                                type="password"
                                placeholder="Minimaal 4 tekens"
                                value={form.password}
                                onChange={handleChange('password')}
                            />
                            <Select
                                label="Rol *"
                                value={form.role}
                                onChange={handleChange('role')}
                                options={roleOptions}
                            />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button variant="primary" onClick={handleCreate}>Gebruiker aanmaken</Button>
                            <Button variant="ghost" onClick={() => { setCreating(false); setForm(emptyForm); }}>
                                Annuleren
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Gebruikerslijst */}
            <Card>
                <CardHeader title={`Alle gebruikers (${users.length})`} />
                <div className="divide-y divide-gray-50">
                    {users.map(user => {
                        const isSelf = user.id === currentUser.id;
                        return (
                            <div key={user.id} className="px-5 py-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-secondary">
                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                            {isSelf && (
                                                <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">jij</span>
                                            )}
                                            <RoleBadge role={user.role} />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    {!isSelf && (
                                        <button
                                            onClick={() => setDeleteModal(user.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                            title="Gebruiker verwijderen"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* ── Bevestigings-modal verwijderen */}
            <ConfirmModal
                open={!!deleteModal}
                title="Gebruiker verwijderen"
                message="Weet je zeker dat je deze gebruiker wilt verwijderen? Alle bijbehorende uren worden ook verwijderd. Dit kan niet ongedaan worden gemaakt."
                confirmLabel="Verwijderen"
                confirmVariant="danger"
                onConfirm={() => handleDelete(deleteModal)}
                onCancel={() => setDeleteModal(null)}
            />
        </div>
    );
};
