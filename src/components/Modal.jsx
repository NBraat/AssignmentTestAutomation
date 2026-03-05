// ═══════════════════════════════════════════════════════════════
// MODAL COMPONENTEN  —  Modal (generiek) + ConfirmModal
// ═══════════════════════════════════════════════════════════════

var Modal = ({ open, onClose, title, children, footer }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-secondary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

var ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Bevestigen',
    danger = false,
}) => (
    <Modal
        open={open}
        onClose={onClose}
        title={title}
        footer={
            <>
                <Button variant="ghost" onClick={onClose}>Annuleren</Button>
                <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
            </>
        }
    >
        <p className="text-sm text-gray-600">{message}</p>
    </Modal>
);
