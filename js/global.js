/* ========================================================
   HEARTSYNC - SHARED UTILITIES & STATE MANAGEMENT
   ======================================================== */

// DOM Selectors
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Local Storage Helper
const storage = {
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error('Storage Read Error:', e);
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage Write Error:', e);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage Remove Error:', e);
        }
    }
};

// Current Active User State
const DEFAULT_USER = {
    name: 'Nurrahmah',
    email: 'nurrahmah@gmail.com'
};

function getCurrentUser() {
    return storage.get('heartsync_user', DEFAULT_USER);
}

function setCurrentUser(user) {
    storage.set('heartsync_user', user);
}

// Dynamic API URL Helper (works whether page is in root or in /html/)
function getApiUrl(endpoint) {
    const isSubfolder = window.location.pathname.includes('/html/');
    return (isSubfolder ? '../api/' : 'api/') + endpoint.replace(/^(\.\.\/api\/|api\/)/, '');
}

// Common SVG Icons used throughout the app
const ICONS = {
    hr: '<svg viewBox="0 0 24 24"><path d="M12 21C5 15 2 12 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-3 7-10 13z"/><path d="M6 12h3l2-3 2 5 1.5-2H18"/></svg>',
    bp: '<svg viewBox="0 0 24 24"><path d="M12 2s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/><path d="M9 14h6M12 11v6"/></svg>',
    gl: '<svg viewBox="0 0 24 24"><path d="M14 3l7 7-4 4-7-7zM12 8 3 17v4h4l9-9"/></svg>',
    wt: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 9a5 5 0 0 1 8 0M12 9l2-2"/></svg>',
    pulse: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-6"/></svg>',
    bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M8 14c-2-1-3-3-3-5a7 7 0 0 1 14 0c0 2-1 4-3 5v1H8z"/></svg>',
    hist: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
    stat: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M18 9v6M15 12h6"/></svg>'
};

