// ═══════════════════════════════════════════════════════════════
// TOAST CONTEXT
// ═══════════════════════════════════════════════════════════════

var ToastContext = React.createContext(null);

var ToastProvider = ({ children }) => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const typeClass = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-amber-500',
        info: 'bg-secondary',
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id}
                        className={`animate-fade-in px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium max-w-sm ${typeClass[t.type] || 'bg-gray-700'}`}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

var useToast = () => React.useContext(ToastContext);
