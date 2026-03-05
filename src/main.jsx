// ═══════════════════════════════════════════════════════════════
// MAIN — rendert de root React boom
// ═══════════════════════════════════════════════════════════════

var Root = () => (
    <AuthProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </AuthProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
