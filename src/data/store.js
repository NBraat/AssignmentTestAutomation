// ═══════════════════════════════════════════════════════════════
// LOCALSTORAGE STORE
// Afhankelijk van: constants.js, defaults.js, cookie.js
// ═══════════════════════════════════════════════════════════════

var store = {
    getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || 'null'),
    setUsers: (u) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(u)),
    getEntries: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]'),
    setEntries: (e) => localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(e)),

    init() {
        const stored = this.getUsers();
        // Migreer oude gebruikers (username-formaat) naar nieuw formaat (email)
        if (!stored || stored.some(u => !u.email)) {
            this.setUsers(DEFAULT_USERS);
            deleteCookie(SESSION_COOKIE); // verwijder eventuele verouderde sessie
        }
        if (!localStorage.getItem(STORAGE_KEYS.ENTRIES)) this.setEntries(DEFAULT_ENTRIES);
    },

    reset() {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.ENTRIES);
        deleteCookie(SESSION_COOKIE);
        this.setUsers(DEFAULT_USERS);
        this.setEntries(DEFAULT_ENTRIES);
    },
};

// Initialiseer bij opstarten
store.init();
