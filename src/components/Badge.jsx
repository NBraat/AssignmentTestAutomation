// ═══════════════════════════════════════════════════════════════
// BADGE COMPONENTEN  —  Badge (status) + RoleBadge (rol)
// ═══════════════════════════════════════════════════════════════

const statusConfig = {
    concept: { label: 'Concept', cls: 'bg-gray-100 text-gray-600' },
    ingediend: { label: 'Ingediend', cls: 'bg-blue-100 text-blue-700' },
    goedgekeurd: { label: 'Goedgekeurd', cls: 'bg-green-100 text-green-700' },
    afgekeurd: { label: 'Afgekeurd', cls: 'bg-red-100 text-red-700' },
};

var Badge = ({ status }) => {
    const { label, cls } = statusConfig[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
};

const roleConfig = {
    admin: { label: 'Admin', cls: 'bg-purple-100 text-purple-700' },
    manager: { label: 'Manager', cls: 'bg-blue-100 text-blue-700' },
    gebruiker: { label: 'Gebruiker', cls: 'bg-gray-100 text-gray-600' },
};

var RoleBadge = ({ role }) => {
    const { label, cls } = roleConfig[role] || { label: role, cls: 'bg-gray-100 text-gray-600' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
};
