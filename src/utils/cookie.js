// ═══════════════════════════════════════════════════════════════
// COOKIE HELPERS
// ═══════════════════════════════════════════════════════════════

var setCookie = (name, value, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
};

var getCookie = (name) => {
    const match = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('='))); }
    catch { return null; }
};

var deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};
