/* ========================================================
   HEARTSYNC - HASIL IDENTIFIKASI KESEHATAN LOGIC
   ======================================================== */

const RISK_LEVELS = {
    rendah: {
        label: 'Rendah',
        cols: ['#0E8A68'],
        pale: '#CFE8DC',
        n: 2,
        pill: ['#DFF3E8', '#5CC596', '#0B6B4F'],
        txt: 'Kabar baik! Resiko kesehatan jantungmu tergolong rendah berdasarkan data yang kamu berikan. Tetap jaga kesehatan jantungmu dengan menerapkan pola hidup sehat setiap hari.'
    },
    sedang: {
        label: 'Sedang',
        cols: ['#2FA866'],
        pale: '#CFE8D6',
        n: 4,
        pill: ['#FBDCAE', '#E8A14A', '#A35A00'],
        txt: 'Yuk! mulai lebih peduli dengan kesehatan jantungmu! Hasil menunjukan resiko sedang. Perbaiki pola hidup dan pertimbangkan konsultasi dengan tenaga kesehatan untuk pemeriksaan lebih lanjut.'
    },
    tinggi: {
        label: 'Tinggi',
        cols: ['#E0902E', '#D9782F', '#C8553A', '#B5324A', '#B5324A', '#B5324A'],
        pale: '#EFD9CF',
        n: 6,
        pill: ['#F8D7B0', '#B0412B', '#8A4A00'],
        txt: 'Kesehatan jantungmu perlu perhatian lebih. Berdasarkan data yang kamu berikan, estimasi resikomu tergolong tinggi. Terapkan rekomendasi yang tersedia di HeartSync secara konsisten, mulai dari pola makan, aktivitas fisik, hingga kebiasaan hidup sehat lainnya.'
    },
    terdiagnosa: {
        label: 'TERDIAGNOSA',
        cols: ['#8E3A6B'],
        pale: '#E9D3E2',
        n: 6,
        pill: ['#E8CDE3', '#A76A9A', '#5C2A52'],
        txt: 'Berdasarkan informasi yang kamu berikan, kamu menyatakan sudah memiliki penyakit jantung. Jangan berkecil hati ya! Kamu tetap bisa berupaya menjaga kualitas hidup dengan menjalankan perawatan yang dianjurkan oleh dokter dan menerapkan pola hidup sehat yang dibantu oleh HeartSync.'
    }
};

function generateGaugeSVG(cfg) {
    let out = '<circle cx="150" cy="150" r="146" fill="#F4F4F1"/>' +
              '<circle cx="150" cy="150" r="104" fill="#FFFFFF" opacity=".92"/>';
    const R = 125;
    for (let i = 0; i < 6; i++) {
        const a0 = (-90 + i * 60 + 5) * Math.PI / 180;
        const a1 = (-90 + (i + 1) * 60 - 5) * Math.PI / 180;
        const p = (a) => [150 + R * Math.cos(a), 150 + R * Math.sin(a)];
        const [x0, y0] = p(a0);
        const [x1, y1] = p(a1);
        const on = i < cfg.n;
        const col = on ? cfg.cols[Math.min(i, cfg.cols.length - 1)] : cfg.pale;
        out += `<path d="M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="round"/>`;
    }
    return out;
}

document.addEventListener('DOMContentLoaded', () => {
    const ringEl = $('#rring');
    const pillEl = $('#rpill');
    const textEl = $('#rtext');

    if (!ringEl || !pillEl || !textEl) return;

    // Retrieve risk data from storage
    let currentRisk = storage.get('heartsync_risk');
    if (!currentRisk) {
        const answers = storage.get('heartsync_answers');
        if (answers && typeof calcRisk === 'function') {
            currentRisk = calcRisk(answers);
        } else {
            currentRisk = { lv: 'sedang', pct: 40 };
        }
        storage.set('heartsync_risk', currentRisk);
    }

    const config = RISK_LEVELS[currentRisk.lv] || RISK_LEVELS.sedang;

    // Render Gauge
    ringEl.innerHTML = generateGaugeSVG(config);

    // Render Status Pill
    pillEl.textContent = config.label;
    pillEl.style.backgroundColor = config.pill[0];
    pillEl.style.borderColor = config.pill[1];
    pillEl.style.color = config.pill[2];
    if (currentRisk.lv === 'terdiagnosa') {
        pillEl.style.fontSize = '14px';
    }

    // Render Result Description
    textEl.textContent = config.txt;
});

