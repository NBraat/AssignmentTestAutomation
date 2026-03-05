// ═══════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// Varianten: primary | secondary | outline | danger | success | ghost
// ═══════════════════════════════════════════════════════════════

var Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    onClick,
    type = 'button',
    className = '',
}) => {
    const base = [
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed select-none',
    ].join(' ');

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
    };

    const variants = {
        primary: 'bg-primary text-secondary hover:bg-primary-dark focus:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
        outline: 'border border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        ghost: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-300',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
