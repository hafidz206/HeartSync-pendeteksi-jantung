/* ========================================================
   HEARTSYNC - AUTHENTICATION (LOGIN & REGISTER) LOGIC
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ── HELPER ──────────────────────────────────────────
    function showError(el, msg) {
        if (!el) return;
        el.textContent = msg;
        el.style.opacity = '1';
        setTimeout(() => {
            el.style.opacity = '0.9';
        }, 4000);
    }

    // ── LOGIN FORM ───────────────────────────────────────
    const loginForm = $('#loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = $('#l-email');
            const passInput = $('#l-pass');
            const errBox = $('#loginError');

            const email = emailInput.value.trim();
            const pass = passInput.value;

            // Validasi form kosong
            if (!email || !pass) {
                showError(errBox, 'Mohon lengkapi email dan kata sandi.');
                return;
            }

            const submitButton = loginForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }

            try {
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: pass
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    if (result.is_verified === false) {
                        storage.set('heartsync_pending_email', email);
                        alert(result.message || 'Akun belum diverifikasi. Silakan masukkan kode verifikasi.');
                        window.location.href = 'verify.html';
                        return;
                    }
                    showError(errBox, result.message || 'Login gagal.');
                    return;
                }

                // Simpan status login
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', result.user.email);

                // Simpan data sesi pengguna ke localStorage
                const userData = {
                    id: result.user.id,
                    name: result.user.name || result.user.nama,
                    nama: result.user.nama || result.user.name,
                    email: result.user.email
                };
                storage.set('heartsync_user', userData);

                // Bersihkan email pending pendaftaran sebelumnya
                storage.remove('heartsync_pending_email');

                alert('Login berhasil! Selamat datang, ' + result.user.nama);

                // Arahkan ke kuesioner (Quiz) sesuai alur aplikasi
                window.location.href = 'quiz.html';

            } catch (error) {
                console.error('Login error:', error);
                showError(errBox, 'Tidak dapat terhubung ke server. Periksa Laragon.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    }

    // ── REGISTER FORM ────────────────────────────────────
    const registerForm = $('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
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

            // Validasi
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

            const submitButton = registerForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            try {
                const formData = new FormData();
                formData.append('nama', name);
                formData.append('email', email);
                formData.append('password', pass);

                const response = await fetch('api/register.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    showError(errBox, result.message || 'Pendaftaran gagal.');
                    return;
                }

                // Simpan email yang sedang mendaftar ke localStorage agar bisa dibaca di halaman verifikasi
                storage.set('heartsync_pending_email', email);

                alert('Pendaftaran berhasil! Silakan masukkan kode verifikasi.');

                // Arahkan ke halaman verifikasi
                window.location.href = 'verify.html';

            } catch (error) {
                console.error('Register error:', error);
                showError(errBox, 'Tidak dapat terhubung ke server.');
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }

    // ── GOOGLE SIGN-IN ───────────────────────────────────
    const googleBtns = $$('.btn-google');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const defaultUser = { name: 'Nurrahmah', email: 'nurrahmah@gmail.com' };
            setCurrentUser(defaultUser);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', defaultUser.email);
            window.location.href = 'quiz.html';
        });
    });

    // ── VERIFICATION CODE PAGE ───────────────────────────
    const codesContainer = $('.codes-grid');
    if (codesContainer) {
        const inputs = $$('.codes-grid input');
        const verifyBtn = $('#vbtn');
        const resendBtn = $('#resend');
        const verifyEmailSpan = $('#vemail');

        const user = getCurrentUser();
        const pendingEmail = storage.get('heartsync_pending_email', user ? user.email : '');
        if (verifyEmailSpan) {
            verifyEmailSpan.textContent = pendingEmail;
        }

        // Auto-jump antar input
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
            verifyBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                // Gabungkan 5 digit input menjadi satu string
                let code = '';
                inputs.forEach(input => code += input.value.trim());

                if (code.length < 5) {
                    alert('Mohon masukkan 5 digit kode verifikasi secara lengkap.');
                    const emptyOne = inputs.find(i => !i.value.trim());
                    if (emptyOne) emptyOne.focus();
                    return;
                }

                // Ambil email dari localStorage
                const email = storage.get('heartsync_pending_email');
                if (!email) {
                    alert('Sesi tidak ditemukan. Silakan daftar ulang.');
                    window.location.href = 'register.html';
                    return;
                }

                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Memverifikasi...';

                try {
                    const response = await fetch('api/verify.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, code: code })
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        alert(result.message || 'Verifikasi gagal. Periksa kode Anda.');
                        // Kosongkan input agar bisa coba lagi
                        inputs.forEach(i => i.value = '');
                        inputs[0].focus();
                        return;
                    }

                    // Bersihkan pending email setelah verifikasi berhasil
                    storage.remove('heartsync_pending_email');

                    alert('Verifikasi berhasil! Silakan login.');
                    window.location.href = 'login.html';

                } catch (error) {
                    console.error('Verify error:', error);
                    alert('Tidak dapat terhubung ke server. Periksa Laragon.');
                } finally {
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = 'Verifikasi Akun';
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
});
