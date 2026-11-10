/* ========================================================
   HEARTSYNC - DASHBOARD VIEWS, CHARTS & DATA LOGIC
   (95%+ Precision Match to Reference Mockup)
   ======================================================== */

// Sleep timer state
let sleepInterval = null;
let sleepSecondsLeft = 27000; // 07:30:00

// Date Formatter
const formatDate = (date) => {
    const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Initial Log Data
function getLogData() {
    let logs = storage.get('hs_log', []);
    if (!logs || !logs.length) {
        logs = [
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 },
            { t: '12 Okt 2026, 08:30', hr: 72, bp: '110/70', gl: 95, wt: 52 }
        ];
        storage.set('hs_log', logs);
    }
    return logs;
}

// Risk and Recommendations Database
const RECOMMENDATIONS = {
    rendah: {
        m: ['Perbanyak sayur, buah, dan biji-bijian utuh', 'Pilih ikan atau sumber protein tanpa lemak', 'Batasi gula tambahan dan konsumsi garam berlebih'],
        o: ['Olahraga aerobik minimal 150 menit/minggu', 'Jalan kaki santai 30 menit setiap hari', 'Latihan kekuatan otot 2 kali/minggu'],
        t: ['Tidur berkualitas 7 - 8 jam per malam', 'Jaga konsistensi jadwal tidur & bangun', 'Hindari paparan gawai 1 jam sebelum tidur']
    },
    sedang: {
        m: ['Kurangi konsumsi gorengan dan makanan olahan', 'Utamakan sayuran hijau, buah, dan serat larut', 'Batasi asupan garam maksimal 1 sendok teh/hari'],
        o: ['Jalan cepat 30 menit, 5 kali per minggu', 'Hindari aktivitas berat yang dilakukan mendadak', 'Pantau detak jantung saat berolahraga secara teratur'],
        t: ['Tidur cukup 7 - 8 jam setiap malam', 'Kurangi asupan kafein setelah sore hari', 'Lakukan teknik relaksasi untuk mengelola stres']
    },
    tinggi: {
        m: ['Terapkan pola makan rendah lemak jenuh dan rendah garam', 'Hindari gorengan, santan kental, dan jeroan', 'Perbanyak asupan sayur, buah segar, dan ikan beromega 3'],
        o: ['Mulai dengan jalan kaki ringan 15-20 menit per hari', 'Konsultasikan program olahraga yang aman ke dokter', 'Segera istirahat bila merasakan nyeri dada atau napas sesak'],
        t: ['Tidur 7 - 8 jam, atur posisi kepala lebih tinggi bila sesak', 'Hindari begadang dan aktivitas berat di malam hari', 'Lakukan pemeriksaan kesehatan berkala ke dokter spesialis']
    },
    terdiagnosa: {
        m: ['Ikuti panduan diet ketat yang dianjurkan oleh dokter', 'Batasi garam, gula, dan makanan berkolesterol tinggi', 'Minum obat resep secara disiplin dan tepat waktu'],
        o: ['Lakukan aktivitas fisik ringan sesuai rekomendasi medis', 'Jangan memaksakan diri bila merasa cepat lelah', 'Segera cari pertolongan medis jika keluhan bertambah berat'],
        t: ['Tidur cukup 7 - 8 jam per hari untuk pemulihan tubuh', 'Jaga jadwal kontrol rutin ke fasilitas pelayanan kesehatan', 'Hindari situasi yang memicu stres emosional berlebih']
    }
};

const RISK_LABELS = {
    rendah: 'Rendah',
    sedang: 'Sedang',
    tinggi: 'Tinggi',
    terdiagnosa: 'Terdiagnosa'
};

function getVitalStatus(entry) {
    const [sys, dia] = entry.bp.split('/').map(Number);
    if (entry.hr > 110 || entry.hr < 50 || sys >= 140 || dia >= 90 || entry.gl >= 180) {
        return ['Tinggi', 'bad'];
    }
    if (entry.hr > 100 || entry.hr < 60 || sys >= 130 || entry.gl >= 140 || sys < 90) {
        return ['Waspada', 'warn'];
    }
    return ['Normal', ''];
}

// Line Chart SVG Generator matching Reference Mockup
function generateLineChart(series, colors, ymin = 30, ymax = 120, height = 180, customTicks = null) {
    const W = 460, L = 36, B = 24, T = 12, n = 7;
    const days = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const getX = (i) => L + (W - L - 14) * i / (n - 1);
    const getY = (val) => T + (height - T - B) * (1 - (val - ymin) / (ymax - ymin));

    // Custom ticks support (e.g. 140, 130... 50 for Data view)
    const ticks = customTicks || [120, 90, 60, 30];
    let svg = `<svg viewBox="0 0 ${W} ${height}" style="width:100%;height:auto;display:block">`;
    
    // Grid Lines
    ticks.forEach(v => {
        const y = getY(v);
        svg += `<line x1="${L}" x2="${W - 6}" y1="${y}" y2="${y}" stroke="#ECECEC" stroke-width="1"/>` +
               `<text x="${L - 8}" y="${y + 3.5}" font-size="9" text-anchor="end" fill="#9CA3AF" font-family="Poppins, sans-serif">${v}</text>`;
    });

    // Days Label
    days.forEach((day, i) => {
        svg += `<text x="${getX(i)}" y="${height - 4}" font-size="8.5" text-anchor="middle" fill="#9CA3AF" font-family="Poppins, sans-serif">${day}</text>`;
    });

    // Polylines & Dots
    series.forEach((s, k) => {
        if (!s || !s.length) return;
        const pts = s.slice(0, n).reverse();
        const pl = pts.map((v, i) => `${getX(i + n - pts.length)},${getY(Math.min(ymax, Math.max(ymin, v)))}`).join(' ');
        svg += `<polyline points="${pl}" fill="none" stroke="${colors[k]}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
               pts.map((v, i) => `<circle cx="${getX(i + n - pts.length)}" cy="${getY(Math.min(ymax, Math.max(ymin, v)))}" r="3" fill="${colors[k]}"/>`).join('');
    });

    svg += '</svg>';
    return svg;
}

// Sleep Timer Formatter
const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(' : ');
};

// Sleep Card Component (Exact Match with Reference Mockup)
function renderSleepCard() {
    return `
    <div class="dash-card sleep-card">
        <div class="sleep-header-row">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF" style="flex-shrink:0">
                <path d="M12.3 2a9.5 9.5 0 1 0 9.7 13.5 8 8 0 0 1-9.7-13.5z"/>
                <path d="M19 1.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/>
                <path d="M22 6.5l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4z"/>
            </svg>
            <h4>Kulitas &amp; Waktu Tidur</h4>
        </div>
        <span class="sleep-sub">Rekomendasi: 7-8 jam/hari</span>
        
        <div class="clock-box">
            <span class="timer-label">SLEEP TIMER &amp; STOPWATCH</span>
            <b id="clk">${formatTimer(sleepSecondsLeft)}</b>
            <div class="sleep-btn-row">
                <button class="btn-r" data-act="sleep" id="sbtn">▶ Mulai Tidur</button>
                <button class="btn-outline-white" data-act="sreset">↺ Reset</button>
            </div>
        </div>

        <div class="sleep-stats-row">
            <span>Kualitas Tidur Semalam</span>
            <b>84% (Sangat Baik)</b>
        </div>
    </div>`;
}

// Hero Component (100% Exact Match with Reference Image)
function renderHero(title, desc, userName, isExactImage = false) {
    if (isExactImage) {
        return `
        <div class="hero-banner hero-banner-exact">
            <img class="hero-banner-img" src="img/banner-hero-exact.png" alt="Halo, ${userName} - Jaga Jantungmu, Mulai dari Sekarang!">
            <div class="sr-only">
                <p>Halo, ${userName}</p>
                <h2>${title}</h2>
                <p>${desc}</p>
            </div>
        </div>`;
    }

    return `
    <div class="hero-banner hero-banner-content-wrap">
        <div class="hero-banner-content">
            <p class="hero-greeting">Halo, ${userName}</p>
            <h2 class="hero-title">${title}</h2>
            <p class="hero-desc">${desc}</p>
        </div>
        <img class="hero-doc" src="img/doctor-banner-id.png" alt="Dokter HeartSync">
    </div>`;
}

// Section Header Component
function renderSection(iconKey, title, subtitle, content) {
    const sectionIcons = {
        pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="#EA3739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="7.5"/><path d="M10.5 7.5v6M7.5 10.5h6"/><path d="M16 16l4.5 4.5"/></svg>`,
        chart: `<svg viewBox="0 0 24 24" fill="none" stroke="#EA3739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>`,
        bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="#EA3739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M8 14c-2-1-3-3-3-5a7 7 0 0 1 14 0c0 2-1 4-3 5v1H8z"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="19.8" y1="4.2" x2="18.4" y2="5.6"/></svg>`,
        hist: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>`,
        stat: `<svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="8"/></svg>`,
        med: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="5"/></svg>`
    };

    return `
    <section class="dash-sec">
        <div class="dash-sec-header">
            <h3 class="dash-sec-title">
                ${sectionIcons[iconKey] || ''}
                <span>${title}</span>
            </h3>
            <p class="dash-sec-subtitle">${subtitle}</p>
        </div>
        ${content}
    </section>`;
}

// Vitals Cards Component (Exact Match with 4 cards & red icons)
function renderVitalsCards(latest) {
    const [statusText, statusClass] = getVitalStatus(latest);
    const badge = `<span class="badge-status ${statusClass}">${statusText}</span>`;
    const lastUpdate = `<div class="vital-card-updated">Terakhir di perbarui<br>21 okt 2026, 08:30</div>`;

    const vitalIcons = {
        hr: `<svg viewBox="0 0 28 28"><path d="M14 25.5C8 19.5 2 15 2 9.5 2 5.5 5 2.5 9 2.5c2.5 0 4.2 1.3 5 2.5.8-1.2 2.5-2.5 5-2.5 4 0 7 3 7 7 0 5.5-6 10-12 16z" fill="#EA3739"/><path d="M6 11.5h3l1.8-4 2.4 8 2-5.5 1.8 1.5H22" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        bp: `<svg viewBox="0 0 28 28"><path d="M14 2.5C14 2.5 5 13 5 18a9 9 0 0 0 18 0c0-5-9-15.5-9-15.5z" fill="#EA3739"/><path d="M10 18h8M14 14v8" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>`,
        gl: `<svg viewBox="0 0 28 28"><path d="M19 3.5l5.5 5.5-2 2-1-1-6.5 6.5V19l-4 4-2-2 1-1h-1l-2-2 1-1v-1l4-4h2.5l6.5-6.5-1-1 2-2z" fill="#EA3739"/><circle cx="10" cy="18" r="1.5" fill="#FFFFFF"/></svg>`,
        wt: `<svg viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="6" fill="#EA3739"/><circle cx="14" cy="9.5" r="3.5" fill="#FFFFFF"/><path d="M14 9.5l1.5-1.5" stroke="#EA3739" stroke-width="1.5" stroke-linecap="round"/></svg>`
    };

    const items = [
        ['hr', 'Detak Jantung', latest.hr + ' Bpm'],
        ['bp', 'Tekanan Darah', latest.bp + ' mmHg'],
        ['gl', 'Gula Darah', latest.gl + ' mg/dl'],
        ['wt', 'Berat Badan', latest.wt + ' kg']
    ];

    return items.map(it => `
        <div class="dash-card vital-card">
            <div class="vital-card-header">
                <div class="vital-card-icon">${vitalIcons[it[0]]}</div>
                <h4 class="vital-card-title">${it[1]}</h4>
            </div>
            <div class="vital-card-val">${it[2]}</div>
            ${badge}
            ${lastUpdate}
        </div>
    `).join('');
}

function renderVitalsGrid(latest) {
    return `<div class="grid-4">${renderVitalsCards(latest)}</div>`;
}

// Main Dashboard Controller
document.addEventListener('DOMContentLoaded', () => {
    const navEl = $('#nav');
    const viewEl = $('#view');
    const modalEl = $('#modal');
    const modalForm = $('#mform');
    const modalCancel = $('#mcancel');

    if (!navEl || !viewEl) return;

    let user = getCurrentUser();
    let risk = storage.get('heartsync_risk', { lv: 'sedang', pct: 40 });
    let logs = getLogData();

    // Get active view from URL params or default to 'beranda'
    const urlParams = new URLSearchParams(window.location.search);
    let activeView = urlParams.get('view') || 'beranda';

    function renderNav() {
        const tabs = [
            ['beranda', 'Beranda'],
            ['data', 'Data'],
            ['kesehatan', 'Kesehatan'],
            ['rekomendasi', 'Rekomendasi'],
            ['profil', 'Profil']
        ];

        navEl.innerHTML = `
            <a href="dashboard.html" class="nav-brand">
                <svg viewBox="0 0 120 100"><use href="#logo"/></svg>
                <span>HeartSync</span>
            </a>
            <div class="nav-tabs">
                ${tabs.map(t => `
                    <button class="tab-btn ${activeView === t[0] ? 'on' : ''}" data-view="${t[0]}">
                        ${t[1]}
                    </button>
                `).join('')}
            </div>
            <div class="nav-user">
                <div class="nav-user-info">
                    <span class="nav-user-name">${user.name || 'Nurrahmah'}</span>
                    <span class="nav-user-status">Resiko ${RISK_LABELS[risk.lv] || 'Rendah'}</span>
                </div>
                <img src="img/asian-medical-doctor-woman-with-white-lab-coat-pink.jpg" class="nav-avatar-img" alt="${user.name}">
            </div>
        `;
    }

    function renderLogTable() {
        return `
        <div class="dash-card log-table-card">
            <table class="log-table">
                <thead>
                    <tr>
                        <th>WAKTU/TANGGAL</th>
                        <th>DETAK JANTUNG</th>
                        <th>TEKANAN DARAH</th>
                        <th>GULA DARAH</th>
                        <th>BERAT BADAN</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.slice(0, 10).map(r => {
                        const [s, c] = getVitalStatus(r);
                        return `
                        <tr>
                            <td>${r.t}</td>
                            <td>${r.hr} bpm</td>
                            <td>${r.bp} mmHg</td>
                            <td>${r.gl} mg/dl</td>
                            <td>${r.wt} kg</td>
                            <td><span class="badge-status ${c}">${s}</span></td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    }

    function renderCharts() {
        return `
        <div class="grid-2">
            <div class="dash-card">
                <div class="chart-header">
                    <span class="title-chart">♥ Tren Detak Jantung &amp; Tekanan Darah</span>
                    <span class="badge-period-pill">Minggu ini</span>
                </div>
                <p style="font-size:12px;color:#6B7280;margin:2px 0 10px">Pantau lonjakan dan rata-rata periodik anda</p>
                ${generateLineChart([logs.map(r => r.hr)], ['#EA3739'], 30, 120, 180)}
            </div>
            <div class="dash-card">
                <div class="chart-header">
                    <span class="title-chart">♥ Tren Gula Darah</span>
                    <span class="badge-period-pill">Minggu ini</span>
                </div>
                <p style="font-size:12px;color:#6B7280;margin:2px 0 10px">Perbandingan fluktuasi harian</p>
                ${generateLineChart([logs.map(r => r.gl)], ['#EA3739'], 30, 120, 180)}
            </div>
        </div>`;
    }

    function renderView() {
        const latest = { hr: 79, bp: '110/70', gl: 98, wt: 52, t: '21 okt 2026, 08:30' };
        const riskLabel = RISK_LABELS[risk.lv] || 'Sedang';
        const recList = RECOMMENDATIONS[risk.lv] || RECOMMENDATIONS.sedang;

        if (activeView === 'beranda') {
            viewEl.innerHTML = 
                renderHero('Jaga Jantungmu,<br>Mulai dari Sekarang!', 'Yuk mulai langkah kecil untuk menjaga kesehatan jantungmu. Kenali kondisi tubuhmu, terapkan pola hidup sehat, dan temukan rekomendasi aktivitas yang sesuai untukmu.', user.name || 'Nurrahmah', true) +
                renderSection('pulse', 'Ringkasan Kesehatan', 'Pantau Indikator kesehatanmu dalam satu tempat', renderVitalsGrid(latest)) +
                renderSection('chart', 'Rekap Data Kesehatan', 'Lihat perkembangan kesehatanmu dari waktu ke waktu', `
                    <div class="rekap-grid">
                        <!-- Column 1: Kondisi Kamu -->
                        <div class="dash-card card-kondisi">
                            <h5>Kondisi Kamu</h5>
                            <span class="subtext">Bedasarkan hasil klasifikasi terakhir</span>
                            
                            <div class="risk-mini-banner">
                                <svg viewBox="0 0 28 28" width="30" height="30" style="flex-shrink:0">
                                    <path d="M14 25.5C8 19.5 2 15 2 9.5 2 5.5 5 2.5 9 2.5c2.5 0 4.2 1.3 5 2.5.8-1.2 2.5-2.5 5-2.5 4 0 7 3 7 7 0 5.5-6 10-12 16z" fill="#EA3739"/>
                                    <path d="M6 11.5h3l1.8-4 2.4 8 2-5.5 1.8 1.5H22" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <div>
                                    <span class="label">Resiko Jantung</span>
                                    <span class="value">${riskLabel}</span>
                                </div>
                            </div>

                            <div class="update-meta">
                                Update Terakhir<br>
                                <span style="color:#6B7280">21 okt 2026, 08:30</span>
                            </div>

                            <button class="btn-outline-pill" data-act="retake">Cek kembali</button>
                        </div>

                        <!-- Column 2: Detak Jantung Chart -->
                        <div class="dash-card">
                            <div class="chart-header">
                                <span class="title-chart">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#EA3739"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    <span>Detak Jantung (bpm)</span>
                                </span>
                                <span class="badge-period-pill">Minggu ini ›</span>
                            </div>
                            ${generateLineChart([logs.map(r => r.hr)], ['#EA3739'], 30, 120, 155)}
                        </div>

                        <!-- Column 3: Rata - Rata -->
                        <div class="dash-card card-avg">
                            <h5>
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#EA3739" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>
                                <span>Rata - Rata</span>
                            </h5>
                            <ul class="avg-list">
                                <li>
                                    <span class="item-label">
                                        <svg viewBox="0 0 24 24" width="13" height="13" fill="#EA3739"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        Detak Jantung
                                    </span>
                                    <b>78 bpm</b>
                                </li>
                                <li>
                                    <span class="item-label">
                                        <svg viewBox="0 0 24 24" width="13" height="13" fill="#EA3739"><path d="M12 2.5C12 2.5 5 12 5 16.5a7 7 0 0 0 14 0c0-4.5-7-14-7-14z"/></svg>
                                        Tekanan Darah
                                    </span>
                                    <b>115/72 mmHg</b>
                                </li>
                                <li>
                                    <span class="item-label">
                                        <svg viewBox="0 0 24 24" width="13" height="13" fill="#EA3739"><path d="M19 3.5l-2-2-1 1-5.5 5.5V11l-3 3-1.5-1.5-1.5 1.5 2 2-3 3 1.5 1.5 3-3 2 2 1.5-1.5-1.5-1.5 3-3h3l5.5-5.5 1 1 2-2-4.5-4.5z"/></svg>
                                        Gula Darah
                                    </span>
                                    <b>100 mg/dl</b>
                                </li>
                                <li>
                                    <span class="item-label">
                                        <svg viewBox="0 0 24 24" width="13" height="13" fill="#EA3739"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="8.5" r="2.5" fill="#FFFFFF"/></svg>
                                        Berat Badan
                                    </span>
                                    <b>52 kg</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                `) +
                renderSection('bulb', 'Rekomendasi Untukmu', 'Pilihlah makanan, olahraga, dan waktu tidur yang sesuai dengan kebutuhanmu', `
                    <div class="recs-grid">
                        <!-- Card 1: Makan Siang -->
                        <div class="dash-card rec-card">
                            <div class="rec-img-holder"></div>
                            <div class="rec-card-top">
                                <h6>Makan Siang</h6>
                                <span class="rec-tag">Makanan</span>
                            </div>
                            <div class="rec-meta">
                                <div class="rec-food-grid">
                                    <span>⦿ Ikan Tuna</span>
                                    <span>⦿ Timun</span>
                                    <span>⦿ Telur</span>
                                    <span>⦿ Selada</span>
                                </div>
                            </div>
                            <div class="rec-calorie">Total <span style="color:#EA3739;font-weight:700">920 Calori</span></div>
                            <button class="btn-outline-pill" data-view="rekomendasi">Lihat selengkapnya</button>
                        </div>

                        <!-- Card 2: Jalan Kaki -->
                        <div class="dash-card rec-card">
                            <div class="rec-img-holder"></div>
                            <div class="rec-card-top">
                                <h6>Jalan kaki</h6>
                                <span class="rec-tag">Olahraga</span>
                            </div>
                            <div class="rec-meta">
                                <span style="color:#EA3739;font-weight:600">Minimal 1.000 langkah</span> Per hari sebagai target awal bagi pemula, sesuaikan kondisi tubuhmu.
                            </div>
                            <button class="btn-outline-pill" data-view="rekomendasi">Lihat selengkapnya</button>
                        </div>

                        <!-- Card 3: Sleep Timer -->
                        ${renderSleepCard()}
                    </div>
                `);
        } else if (activeView === 'data') {
            const hrSeries = logs.map(r => r.hr);
            const bpSeries = logs.map(r => parseInt(String(r.bp).split('/')[0], 10) || 110);
            const glSeries = logs.map(r => r.gl);

            const toolbarHtml = `
                <div class="filter-toolbar-row">
                    <div class="period-segmented-group">
                        <button class="period-btn on" data-period="mingguan">Mingguan</button>
                        <button class="period-btn" data-period="bulanan">Bulanan</button>
                        <button class="period-btn" data-period="tahunan">Tahunan</button>
                    </div>
                    <div class="data-actions-group">
                        <button class="btn-primary-pill" data-act="add">+ Tambah Data</button>
                        <button class="btn-primary-pill" data-act="pdf">
                            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>
            `;

            const chartsHtml = `
                <div class="grid-2">
                    <!-- Card 1: Detak Jantung dan Tekanan Darah -->
                    <div class="dash-card data-chart-card">
                        <div class="data-chart-header">
                            <div class="data-chart-info">
                                <h5 class="data-chart-title">
                                    <svg viewBox="0 0 24 24" class="data-chart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    <span>Grafik Tren Detak Jantung<br>dan Tekanan Darah</span>
                                </h5>
                                <p class="data-chart-desc">Pantau lonjakan dan<br>rata rata periodik anda</p>
                            </div>
                            <div class="data-chart-meta">
                                <span class="badge-period-pill-subtle">Minggu ini ▾</span>
                                <div class="data-legends-list">
                                    <div class="data-legend-item">
                                        <span class="legend-color-dot" style="background:#EA3739"></span>
                                        <span>Detak Jantung</span>
                                    </div>
                                    <div class="data-legend-item">
                                        <span class="legend-color-dot" style="background:#3B82F6"></span>
                                        <span>Tekanan Darah</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="data-chart-svg-wrap">
                            ${generateLineChart([hrSeries, bpSeries], ['#EA3739', '#3B82F6'], 50, 140, 250, [140, 130, 120, 110, 100, 90, 80, 70, 60, 50])}
                        </div>
                    </div>

                    <!-- Card 2: Gula Darah -->
                    <div class="dash-card data-chart-card">
                        <div class="data-chart-header">
                            <div class="data-chart-info">
                                <h5 class="data-chart-title">
                                    <svg viewBox="0 0 24 24" class="data-chart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    <span>Grafik Tren Gula Darah</span>
                                </h5>
                                <p class="data-chart-desc">Perbandingan fluktuasi<br>harian</p>
                            </div>
                            <div class="data-chart-meta">
                                <span class="badge-period-pill-subtle">Minggu ini ▾</span>
                                <div class="data-legends-list">
                                    <div class="data-legend-item">
                                        <span class="legend-color-dot" style="background:#E3A008"></span>
                                        <span>Gula Darah</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="data-chart-svg-wrap">
                            ${generateLineChart([glSeries], ['#E3A008'], 50, 140, 250, [140, 130, 120, 110, 100, 90, 80, 70, 60, 50])}
                        </div>
                    </div>
                </div>
            `;

            const logSectionHtml = `
                <div class="log-actions-bar">
                    <button class="btn-export-pdf" data-act="pdf">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        <span>Ekspor PDF</span>
                    </button>
                </div>
                ${renderLogTable()}
            `;

            viewEl.innerHTML = 
                renderHero('Rekam dan Pantau,<br>Riwayat Kesehatanmu!', 'Lihat perkembangan grafik vitalitas tubuhmu secara teratur untuk keputusan pola hidup yang lebih tepat', user.name || 'Nurrahmah') +
                renderSection('chart', 'Rekap Data Kesehatan', 'Pantau grafik, tren dan log riwayat vitalitas tubuh anda secara aktual', toolbarHtml + chartsHtml) +
                renderSection('hist', 'Log Catatan Riwayat Kesehatan', 'Daftar entri pengukuran terbaru yang berhasil dicatat', logSectionHtml);
        } else if (activeView === 'kesehatan') {
            const diagContentHtml = `
                <div class="kesehatan-grid">
                    <!-- Left Column: Status dan Diagnosis Box -->
                    <div class="dash-card card-diag-main">
                        <div class="diag-red-box">
                            <div class="donut-gauge">
                                <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Full 360 track circle -->
                                    <circle cx="80" cy="80" r="56"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.22)"
                                        stroke-width="18"/>
                                    <!-- Yellow progress arc: 40% = 140.74, starts at 9 o'clock (-180deg) -->
                                    <circle cx="80" cy="80" r="56"
                                        fill="none"
                                        stroke="#EEFB00"
                                        stroke-width="18"
                                        stroke-linecap="butt"
                                        stroke-dasharray="140.74 211.12"
                                        transform="rotate(-180 80 80)"/>
                                    <!-- Center text group -->
                                    <text x="80" y="66" text-anchor="middle" font-family="Poppins,sans-serif" font-size="11.5" fill="rgba(255,255,255,0.95)" font-weight="500">Tingkat Resiko</text>
                                    <text x="80" y="90" text-anchor="middle" font-family="Poppins,sans-serif" font-size="22" fill="#FFFFFF" font-weight="800">${riskLabel}</text>
                                    <text x="80" y="106" text-anchor="middle" font-family="Poppins,sans-serif" font-size="12" fill="#EEFB00" font-weight="700">${risk.pct}% Resiko</text>
                                </svg>
                            </div>
                            <p class="diag-red-note">Bedasarkan algoritma klasifikasi faktor klinis HeartSync</p>
                        </div>
                        
                        <div class="diag-meta-box">
                            <span class="diag-update-pill">Update : Hari Ini</span>
                            <div class="diag-reminder-row">
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                                <span>Jaga durasi tidur 7-9 jam perhari &amp;<br>lakukan pola hidup sehat</span>
                            </div>
                            <button class="btn-diag-rekomendasi" data-view="rekomendasi">Lihat Rekomendasi</button>
                        </div>
                    </div>

                    <!-- Right Column: 2x2 Vitals Grid -->
                    <div class="vitals-grid-2x2">
                        ${renderVitalsCards(latest)}
                    </div>
                </div>
            `;

            const logSectionHtml = `
                <div class="log-actions-bar">
                    <button class="btn-export-pdf" data-act="pdf">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span>Ekspor PDF</span>
                    </button>
                </div>
                ${renderLogTable()}
            `;

            viewEl.innerHTML = 
                renderHero(
                    'Rekam dan Pantau,<br>Riwayat Kesehatanmu!',
                    'Lihat perkembangan grafik vitalitas tubuhmu secara teratur untuk keputusan pola hidup yang lebih tepat',
                    user.name || 'Nurrahmah'
                ) +
                renderSection('med', 'Status dan Diagnosis Kesehatan', 'Evaluasi komprehensif indikator vital, skor risiko, dan tren kebugaran', diagContentHtml) +
                renderSection('hist', 'Log Catatan Riwayat Kesehatan', 'Daftar entri pengukuran terbaru yang berhasil dicatat', logSectionHtml);
        } else if (activeView === 'rekomendasi') {
            viewEl.innerHTML = 
                renderHero('Rekomendasi Personal,<br>Untuk Menjaga Jantung', `Saran makanan, olahraga, dan pola tidur berdasarkan estimasi risiko (${riskLabel}) dan data kesehatanmu.`, user.name || 'Nurrahmah') +
                renderSection('bulb', 'Panduan Aktivitas Harian', 'Terapkan secara konsisten demi kesehatan jangka panjang', `
                    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:18px">
                        ${[
                            ['🍛 Pola Makan', recList.m],
                            ['🚶 Aktivitas & Olahraga', recList.o],
                            ['😴 Istirahat & Tidur', recList.t]
                        ].map(col => `
                            <div class="dash-card">
                                <h6 style="font-size:16px;color:#EA3739;font-weight:700;margin-bottom:12px">${col[0]}</h6>
                                <ul style="padding-left:18px;font-size:13px;color:#374151;line-height:1.6">
                                    ${col[1].map(it => `<li style="margin-bottom:8px">${it}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:22px">
                        ${renderSleepCard()}
                    </div>
                    <p style="font-size:12px;color:#6B7280;margin-top:18px;text-align:center">
                        * Rekomendasi ini bersifat edukatif dan bukan pengganti diagnosis medis resmi dari dokter.
                    </p>
                `);
        } else if (activeView === 'profil') {
            viewEl.innerHTML = renderSection('stat', 'Profil Pengguna', 'Informasi akun dan riwayat identifikasi kamu', `
                <div class="dash-card profile-card">
                    <img src="img/asian-medical-doctor-woman-with-white-lab-coat-pink.jpg" class="nav-avatar-img" alt="${user.name}">
                    <h3 style="justify-content:center;color:#111827;font-size:20px;font-weight:700">${user.name || 'Nurrahmah'}</h3>
                    <p style="color:#6B7280;margin:4px 0 12px;font-size:13.5px">${user.email}</p>
                    <div style="background:#FFF5F6;border-radius:14px;padding:12px;margin:16px 0">
                        <span style="font-size:12px;color:#4B5563">Estimasi Resiko Terkini:</span>
                        <b style="color:#EA3739;font-size:16px;display:block;margin-top:2px">${riskLabel} (${risk.pct}%)</b>
                    </div>
                    <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
                        <button class="btn-primary" data-act="retake" style="padding:8px 22px;border-radius:9999px;font-size:13px">Isi Ulang Kuesioner</button>
                        <button class="btn-outline-pill" data-act="logout" style="padding:7px 22px">Keluar Akun</button>
                    </div>
                </div>
            `);
        }

        window.scrollTo(0, 0);
    }

    // Global Click Handler for Tabs and Actions
    document.addEventListener('click', (e) => {
        const viewTrigger = e.target.closest('[data-view]');
        if (viewTrigger) {
            e.preventDefault();
            activeView = viewTrigger.dataset.view;
            renderNav();
            renderView();
            return;
        }

        const periodTrigger = e.target.closest('[data-period]');
        if (periodTrigger) {
            e.preventDefault();
            const group = periodTrigger.closest('.period-segmented-group');
            if (group) {
                group.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('on'));
                periodTrigger.classList.add('on');
            }
            return;
        }

        const actionTrigger = e.target.closest('[data-act]');
        if (actionTrigger) {
            e.preventDefault();
            const act = actionTrigger.dataset.act;

            if (act === 'pdf') {
                window.print();
            } else if (act === 'add') {
                if (modalEl) modalEl.classList.add('open');
            } else if (act === 'retake') {
                window.location.href = 'quiz.html';
            } else if (act === 'logout') {
                storage.remove('heartsync_user');
                window.location.href = 'login.html';
            } else if (act === 'sleep') {
                const sbtn = $('#sbtn');
                const clk = $('#clk');
                if (sleepInterval) {
                    clearInterval(sleepInterval);
                    sleepInterval = null;
                    if (sbtn) sbtn.textContent = '▶ Mulai Tidur';
                } else {
                    if (sbtn) sbtn.textContent = '⏸ Jeda';
                    sleepInterval = setInterval(() => {
                        sleepSecondsLeft = Math.max(0, sleepSecondsLeft - 1);
                        if (clk) clk.textContent = formatTimer(sleepSecondsLeft);
                        if (!sleepSecondsLeft) {
                            clearInterval(sleepInterval);
                            sleepInterval = null;
                            if (sbtn) sbtn.textContent = '▶ Mulai Tidur';
                        }
                    }, 1000);
                }
            } else if (act === 'sreset') {
                clearInterval(sleepInterval);
                sleepInterval = null;
                sleepSecondsLeft = 27000;
                const clk = $('#clk');
                const sbtn = $('#sbtn');
                if (clk) clk.textContent = formatTimer(sleepSecondsLeft);
                if (sbtn) sbtn.textContent = '▶ Mulai Tidur';
            }
        }
    });

    // Modal Form Submissions
    if (modalCancel) {
        modalCancel.onclick = () => modalEl.classList.remove('open');
    }

    if (modalForm) {
        modalForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(modalForm);
            const newEntry = {
                t: formatDate(new Date()),
                hr: Number(formData.get('hr')),
                bp: formData.get('bp'),
                gl: Number(formData.get('gl')),
                wt: Number(formData.get('wt'))
            };

            logs.unshift(newEntry);
            logs = logs.slice(0, 30);
            storage.set('hs_log', logs);

            modalEl.classList.remove('open');
            modalForm.reset();
            renderView();
        };
    }

    // Initialize Page
    renderNav();
    renderView();
});
