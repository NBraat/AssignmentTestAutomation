// ═══════════════════════════════════════════════════════════════
// CARD COMPONENTEN  —  Card + CardHeader
// ═══════════════════════════════════════════════════════════════

var Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
        {children}
    </div>
);

var CardHeader = ({ title, subtitle, action }) => (
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
            <h3 className="font-semibold text-secondary">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
    </div>
);
