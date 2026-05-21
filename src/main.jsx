// ═══════════════════════════════════════════════════════════════
// MAIN — rendert de root React boom
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const Root = () => (
    <AuthProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </AuthProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
