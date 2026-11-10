/* ========================================================
   HEARTSYNC - AUTHENTICATION (LOGIN & REGISTER) LOGIC
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Login Form Handler
    const loginForm = $('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = $('#l-email');
            const passInput = $('#l-pass');
            const errBox = $('#loginError');

            const email = emailInput.value.trim();
            const pass = passInput.value;

            if (!email || !pass) {
                showError(errBox, 'Mohon lengkapi email dan kata sandi.');
                return;
            }

            if (!emailRegex.test(email)) {
                showError(errBox, 'Format email tidak valid.');
                emailInput.focus();
                return;
            }

            // Extract display name from email or storage
            const existingUser = getCurrentUser();
            const userName = (existingUser && existingUser.email === email) 
                ? existingUser.name 
                : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            setCurrentUser({ name: userName, email: email });
            window.location.href = 'welcome.html';
        });
    }

    // Register Form Handler
    const registerForm = $('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = $('#r-nama');
            const emailInput = $('#r-email');
            const passInput = $('#r-pass');
            const pass2Input = $('#r-pass2');
            const errBox = $('#registerError');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const pass = passInput.value;
            const pass2 = pass2Input.value;

            if (!name || !email || !pass || !pass2) {
                showError(errBox, 'Mohon lengkapi semua kolom pendaftaran.');
                return;
            }

            if (!emailRegex.test(email)) {
                showError(errBox, 'Format email tidak valid.');
                emailInput.focus();
                return;
            }

            if (pass.length < 6) {
                showError(errBox, 'Kata sandi minimal 6 karakter.');
                passInput.focus();
                return;
            }

            if (pass !== pass2) {
                showError(errBox, 'Konfirmasi kata sandi tidak cocok.');
                pass2Input.focus();
                return;
            }

            // Save user and go to verification
            setCurrentUser({ name, email });
            storage.set('heartsync_pending_email', email);
            window.location.href = 'verify.html';
        });
    }

    // Google Sign-in Buttons
    const googleBtns = $$('.btn-google');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const defaultUser = { name: 'Nurrahmah', email: 'nurrahmah@gmail.com' };
            setCurrentUser(defaultUser);
            window.location.href = 'welcome.html';
        });
    });

    // Verification Code Page Logic
    const codesContainer = $('.codes-grid');
    if (codesContainer) {
        const inputs = $$('.codes-grid input');
        const verifyBtn = $('#vbtn');
        const resendBtn = $('#resend');
        const verifyEmailSpan = $('#vemail');

        // Display user email
        const user = getCurrentUser();
        const pendingEmail = storage.get('heartsync_pending_email', user ? user.email : 'nurrahmah@gmail.com');
        if (verifyEmailSpan) {
            verifyEmailSpan.textContent = pendingEmail;
        }

        // Auto jump inputs
        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '');
                if (input.value && inputs[idx + 1]) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && inputs[idx - 1]) {
                    inputs[idx - 1].focus();
                }
            });
        });

        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const isComplete = inputs.every(i => i.value.trim() !== '');
                if (isComplete) {
                    window.location.href = 'welcome.html';
                } else {
                    const emptyOne = inputs.find(i => !i.value.trim());
                    if (emptyOne) emptyOne.focus();
                }
            });
        }

        if (resendBtn) {
            resendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resendBtn.textContent = 'Kode terkirim ✓';
                setTimeout(() => {
                    resendBtn.textContent = 'Kirim ulang';
                }, 2500);
            });
        }
    }

    function showError(el, msg) {
        if (!el) return;
        el.textContent = msg;
        el.style.opacity = '1';
        setTimeout(() => {
            el.style.opacity = '0.9';
        }, 4000);
    }
});

