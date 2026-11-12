/* ========================================================
   HEARTSYNC - KUESIONER (QUIZ) LOGIC & RISK ALGORITHM
   ======================================================== */

const QUESTIONS = [
    { q: "Berapa Usia anda?", o: ["<30 tahun", "30-39 tahun", "40-49 tahun", ">50 tahun"] },
    { q: "Apa jenis kelamin anda?", o: ["Laki - laki", "Perempuan"] },
    { q: "Berapa berat badan anda?", o: ["<50 kg", "50-69 kg", "70-89 kg", ">90 kg"] },
    { q: "Berapa tinggi badan anda?", o: ["<150 cm", "150-169 cm", "170-189 cm", ">190 cm"] },
    { q: "Bagaimana kondisi tekanan darah anda?", o: ["Normal", "Cendurung rendah", "Cendurung tinggi", "Tidak tahu"] },
    { q: "Bagaimana kadar kolestrol anda?", o: ["Normal", "Cendurung rendah", "Cendurung tinggi", "Tidak tahu"] },
    { q: "Apakah anda memiliki riwayat diabetes?", o: ["Tidak ada", "Prediabetes", "Ya, diabetes", "Tidak tahu"] },
    { q: "Apakah anda memiliki riwayat penyakit jantung?", o: ["Tidak ada", "Ada pada diri sendiri", "Ada pada keluarga", "Tidak tahu"] },
    { q: "Apakah anda memiliki kebiasaan merokok?", o: ["Tidak pernah", "Mantan perokok", "Kadang - kadang", "Perokok aktif"] },
    { q: "Seberapa sering anda berolahraga?", o: ["Tidak pernah", "Jarang", "1-2 kali/minggu", "3 kali atau lebih/minggu"] },
    { q: "Apakah anda pernah merasakan nyeri atau tekanan dada ?", o: ["Tidak pernah", "kadang - kadang", "Sering", "Setiap hari"] },
    { q: "Kapan anda biasanya merasa sesak nafas?", o: ["Tidak pernah", "Saat beraktivitas ringan", "Saat beraktivitas berat", "Sering tanpa sebab"] },
    { q: "Apakah anda merasa mudah lelah?", o: ["Tidak pernah", "kadang-kadang", "Saat beraktivitas", "Sering tanpa sebab"] }
];

function calcRisk(answers) {
    const ix = (i) => QUESTIONS[i].o.indexOf(answers[i]);
    if (ix(7) === 1) {
        return { lv: 'terdiagnosa', pct: 100, sc: 24 };
    }
    
    let sc = (ix(0) >= 0 ? ix(0) : 0) 
        + (ix(2) === 3 ? 1 : 0) 
        + (ix(4) === 2 ? 2 : ix(4) === 1 ? 1 : 0) 
        + (ix(5) === 2 ? 2 : ix(5) === 1 ? 1 : 0) 
        + (ix(6) >= 0 ? ix(6) : 0) 
        + (ix(7) === 2 ? 1 : 0)
        + ([0, 1, 1, 2][ix(8)] || 0) 
        + ([2, 1, 0, 0][ix(9)] || 0) 
        + (ix(10) >= 0 ? ix(10) : 0) 
        + (ix(11) >= 0 ? ix(11) : 0) 
        + (ix(12) >= 0 ? ix(12) : 0);

    const pct = Math.min(95, Math.max(5, Math.round(sc / 24 * 100)));
    const lv = sc <= 5 ? 'rendah' : sc <= 11 ? 'sedang' : 'tinggi';
    return { lv, pct, sc };
}

document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    let userAnswers = [];

    const barsContainer = $('#bars');
    const qTitle = $('#qtitle');
    const optsContainer = $('#opts');
    const nextBtn = $('#next');
    const backBtn = $('#back');

    if (!qTitle || !optsContainer) return;

    // Initialize progress bars
    if (barsContainer) {
        barsContainer.innerHTML = QUESTIONS.map(() => '<i></i>').join('');
    }

    function renderQuestion() {
        const item = QUESTIONS[currentStep];
        qTitle.textContent = item.q;

        // Update progress bar
        $$('#bars i').forEach((bar, idx) => {
            bar.classList.toggle('on', idx <= currentStep);
        });

        // Render option buttons
        optsContainer.innerHTML = '';
        optsContainer.className = 'quiz-opts' + (item.o.length <= 2 ? ' opts-centered' : '');
        item.o.forEach(optText => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'opt-btn' + (userAnswers[currentStep] === optText ? ' selected' : '');
            btn.textContent = optText;

            btn.onclick = () => {
                userAnswers[currentStep] = optText;
                $$('.opt-btn').forEach(b => b.classList.toggle('selected', b === btn));
                nextBtn.classList.add('ready');
            };

            optsContainer.appendChild(btn);
        });

        // Update button states
        nextBtn.classList.toggle('ready', userAnswers[currentStep] !== undefined);
        nextBtn.textContent = (currentStep === QUESTIONS.length - 1) ? 'Selesai' : 'Berikutnya';
        
        if (backBtn) {
            backBtn.classList.add('show');
            backBtn.textContent = (currentStep === 0) ? '← Kembali ke Halaman Selamat Datang' : '← Soal Sebelumnya';
        }
    }

    async function simpanHasilKuesioner(totalSkor, teksHasil) {
        let userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            const u = storage.get('heartsync_user');
            if (u && u.email) userEmail = u.email;
        }

        if (!userEmail) {
            alert('Sesi login habis, silakan login ulang.');
            window.location.href = 'login.html';
            return;
        }

        try {
            if (nextBtn) {
                nextBtn.disabled = true;
                nextBtn.textContent = 'Menyimpan...';
            }

            const response = await fetch(getApiUrl('save_quiz.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    score: totalSkor,
                    result_text: teksHasil
                })
            });

            const result = await response.json();
            if (result.success) {
                console.log('Kuesioner tersimpan:', result.message);
                // Simpan juga sementara di localStorage jika result.html membutuhkannya langsung
                localStorage.setItem('lastQuizResult', JSON.stringify({ score: totalSkor, text: teksHasil }));
                window.location.href = 'result.html';
            } else {
                alert('Gagal menyimpan kuesioner: ' + result.message);
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Selesai';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal terhubung ke server.');
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.textContent = 'Selesai';
            }
        }
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            if (userAnswers[currentStep] === undefined) return;

            if (currentStep < QUESTIONS.length - 1) {
                currentStep++;
                renderQuestion();
            } else {
                // Save answers & calculated risk to storage
                const calculated = calcRisk(userAnswers);
                storage.set('heartsync_answers', userAnswers);
                storage.set('heartsync_risk', calculated);

                // Kirim hasil kuesioner ke database
                simpanHasilKuesioner(calculated.sc, calculated.lv);
            }
        };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (currentStep > 0) {
                currentStep--;
                renderQuestion();
            } else {
                window.location.href = 'landing.html';
            }
        };
    }

    // Start questionnaire
    renderQuestion();
});

