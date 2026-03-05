// ═══════════════════════════════════════════════════════════════
// PAGINA: LOGIN
// ═══════════════════════════════════════════════════════════════

var LoginPage = () => {
    const { login } = useAuth();
    const [form, setForm] = React.useState({ email: '', password: '' });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const demoAccounts = [
        { email: 'admin@voorbeeld.nl', password: 'Admin123!', role: ROLES.ADMIN },
        { email: 'manager@voorbeeld.nl', password: 'Manager123!', role: ROLES.MANAGER },
        { email: 'user@voorbeeld.nl', password: 'User123!', role: ROLES.GEBRUIKER },
    ];

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            {/* Achtergrondversieringen */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / merk */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
                        <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Uren<span className="text-primary">Portaal</span>
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Meld u aan om verder te gaan</p>
                </div>

                {/* Loginkaart */}
                <div className="bg-white rounded-2xl shadow-2xl p-7">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="E-mailadres"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            placeholder="naam@voorbeeld.nl"
                            required
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                        <Input
                            label="Wachtwoord"
                            type="password"
                            autoComplete="current-password"
                            value={form.password}
                            placeholder="••••••••"
                            required
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <Button type="submit" variant="secondary" size="lg" disabled={loading} className="w-full">
                            {loading ? 'Bezig met inloggen…' : 'Inloggen'}
                        </Button>
                    </form>

                    {/* Demo accounts */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demo accounts</p>
                        <div className="space-y-1.5">
                            {demoAccounts.map(acc => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => setForm({ email: acc.email, password: acc.password })}
                                    className="w-full text-left px-3.5 py-2.5 rounded-lg bg-gray-50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all flex justify-between items-center group"
                                >
                                    <div>
                                        <span className="text-sm font-medium text-gray-800 group-hover:text-secondary">{acc.email}</span>
                                        <span className="text-xs text-gray-400 ml-2">{acc.password}</span>
                                    </div>
                                    <RoleBadge role={acc.role} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
