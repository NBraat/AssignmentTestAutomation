// ═══════════════════════════════════════════════════════════════
// FORMULIERVELDEN  —  Input · Textarea · Select
// ═══════════════════════════════════════════════════════════════

// fieldBase ook globaal beschikbaar als andere bestanden het ooit nodig hebben
var fieldBase = 'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors';

var Input = ({ label, error, hint, className = '', ...props }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
            className={`${fieldBase} ${error
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'}`}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
);

var Textarea = ({ label, error, rows = 3, className = '', ...props }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea
            rows={rows}
            className={`${fieldBase} resize-none ${error
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'}`}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

var Select = ({ label, error, children, options, className = '', ...props }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select
            className={`${fieldBase} bg-white ${error
                ? 'border-red-400'
                : 'border-gray-300 hover:border-gray-400'}`}
            {...props}
        >
            {options
                ? options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))
                : children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);
