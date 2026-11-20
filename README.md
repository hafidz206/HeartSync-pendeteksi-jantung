# HeartSync - AI for Heart Health ❤️

**HeartSync** adalah platform web terintegrasi untuk mengenali risiko kesehatan jantung, memantau riwayat vitalitas tubuh (detak jantung, tekanan darah, gula darah, berat badan), serta memberikan rekomendasi personal (pola makan, olahraga, dan waktu tidur) guna mendukung gaya hidup yang lebih sehat.

Platform ini dilengkapi dengan:
- **Dashboard Pengguna** interaktif yang mencakup Ringkasan Kesehatan, Rekap Grafik Tren, Status Diagnosis, Rekomendasi Terpadu, dan Profil Akun.
- **Admin Workspace** profesional dengan 5 modul: Ringkasan Admin, Manajemen Kuesioner, Manajemen Data Pengguna & Email Custom (`@heartsync.com`), Manajemen Konten Rekomendasi, dan Profil Admin.
- **Machine Learning**: Model klasifikasi risiko kardiovaskular berbasis Support Vector Machine (SVM).
- **Backend REST API**: Menggunakan PHP & PDO MySQL untuk menangani autentikasi, OTP verifikasi, pencatatan pengukuran, hasil kuesioner, dan manajemen pengguna.

---

## 📁 Struktur Folder Proyek

```text
HeartSync-pendeteksi-jantung/
├── api/                    # Backend REST API (PHP & PDO MySQL)
│   ├── admin_users.php     # Endpoint admin: kelola pengguna, role & custom email
│   ├── get_code.php        # Endpoint bantuan kode verifikasi
│   ├── get_history.php     # Endpoint riwayat kuesioner & pengukuran user
│   ├── koneksi.php         # Konfigurasi koneksi database PDO
│   ├── login.php           # Autentikasi & session login
│   ├── register.php        # Pendaftaran user & hashing password
│   ├── save_measurement.php # Penyimpanan data vitalitas (BPM, BP, gula, berat)
│   ├── save_quiz.php       # Penyimpanan hasil kuesioner skrining
│   ├── test_koneksi.php    # Diagnostik koneksi database
│   └── verify.php          # Verifikasi akun & kode OTP
│
├── database/               # Database MySQL Dump & Schema
│   └── heartsync_db.sql    # Schema database lengkap beserta data awal (users, kuesioner, pengukuran)
│
├── html/                   # Halaman Tampilan Web (Frontend HTML)
│   ├── admin.html          # Panel Dashboard Workspace Admin
│   ├── dashboard.html      # Dashboard Pengguna (Beranda, Data, Kesehatan, Rekomendasi, Profil)
│   ├── landing.html        # Landing page edukasi & CTA
│   ├── login.html          # Halaman masuk (User & Admin)
│   ├── quiz.html           # Skrining awal risiko jantung (Kuesioner klinis)
│   ├── register.html       # Halaman registrasi akun baru
│   ├── result.html         # Tampilan hasil analisis kuesioner
│   ├── verify.html         # Verifikasi email & akun
│   └── welcome.html        # Halaman selamat datang utama
│
├── css/                    # Stylesheet Tampilan (Modular CSS)
│   ├── admin.css           # Styling Admin Workspace
│   ├── auth.css            # Styling login, register & verifikasi
│   ├── dashboard.css       # Styling Dashboard Pengguna (Exact Match Mockup)
│   ├── global.css          # Variabel warna, tipografi Poppins & reset CSS
│   ├── landing.css         # Styling landing page
│   ├── quiz.css            # Styling formulir kuesioner
│   ├── result.css          # Styling hasil analisis
│   └── welcome.css         # Styling halaman selamat datang
│
├── js/                     # Logika Frontend & Integrasi API
│   ├── auth.js             # Validasi auth, routing role & API caller
│   ├── dashboard.js        # Controller render views, charts SVG, sleep timer & data log
│   ├── global.js           # Helper global (API endpoint, storage, sanitasi)
│   ├── quiz.js             # Interaksi kuesioner & perhitungan skor risiko
│   └── result.js           # Penampil hasil skor & rekomendasi
│
├── img/                    # Asset Gambar & Ilustrasi UI
│   ├── banner-hero-exact.png
│   ├── doctor-banner-id.png
│   ├── food-*.png          # Gambar menu rekomendasi makanan (sarapan, siang, malam)
│   ├── sport-*.png         # Gambar rekomendasi olahraga (yoga, sepeda, jalan)
│   └── user-avatar-*.png   # Avatar profil pengguna & admin
│
├── ml/                     # Machine Learning Pipeline (Python)
│   ├── dataset/            # Dataset klinis penyakit jantung
│   │   └── heart_disease.csv
│   ├── models/             # Model terlatih yang diekspor
│   │   └── svm_heart_model.joblib
│   ├── train.py            # Script pelatihan model SVM
│   └── *.py                # Skrip analisis statistik & korelasi fitur
│
├── index.html              # Entry point utama (auto-redirect ke html/welcome.html)
├── welcome.html            # Alias entry point (auto-redirect ke html/welcome.html)
└── .gitignore              # Konfigurasi file yang diabaikan oleh Git
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Kebutuhan Sistem
- **Web Server**: Apache (Laragon / XAMPP)
- **PHP**: Versi 7.4 ke atas (Disarankan PHP 8.x)
- **Database**: MySQL 8.x / MariaDB
- **Browser Modern**: Chrome, Edge, Firefox, atau Safari

### 2. Langkah Pemasangan
1. **Clone repositori**:
   ```bash
   git clone https://github.com/hafidz206/HeartSync-pendeteksi-jantung.git
   ```
2. **Pindahkan folder ke web root**:
   - Jika menggunakan **Laragon**: letakkan di `C:\laragon\www\HeartSync-pendeteksi-jantung`
   - Jika menggunakan **XAMPP**: letakkan di `C:\xampp\htdocs\HeartSync-pendeteksi-jantung`

3. **Import Database**:
   - Buka **phpMyAdmin** (`http://localhost/phpmyadmin`) atau **HeidiSQL**.
   - Buat database baru bernama `heartsync_db`.
   - Import file `database/heartsync_db.sql` ke dalam database `heartsync_db`.

4. **Konfigurasi Database (Jika diperlukan)**:
   - Buka file `api/koneksi.php`.
   - Sesuaikan konfigurasi host, user, dan password MySQL Anda (default Laragon: user `root`, password kosong).

5. **Akses Aplikasi**:
   - Buka browser dan buka:
     ```text
     http://localhost/HeartSync-pendeteksi-jantung/
     ```
   - Halaman akan otomatis mengarahkan ke halaman sambutan (`html/welcome.html`).

---

## 🔑 Akun & Hak Akses

Sistem menggunakan email untuk membedakan hak akses secara otomatis:
- **Akun Admin**:
  - Email berakhiran domain `@heartsync.com` (atau email yang diset role `admin` di database).
  - Admin langsung diarahkan ke **Admin Workspace** (`html/admin.html`) tanpa perlu mengisi kuesioner.
  - Akun admin bawaan: `hafidz@heartsync.com` / `hafidz@gmail.com`.
- **Akun Pengguna Biasa**:
  - Menggunakan email reguler (misal `@gmail.com`).
  - Setelah login, pengguna yang belum mengisi kuesioner akan dipandu ke kuesioner skrining terlebih dahulu, kemudian diarahkan ke **Dashboard Pengguna** (`html/dashboard.html`).

---

## 🛡️ Lisensi & Hak Cipta
© 2026 **HeartSync** • AI for Health. Seluruh hak cipta dilindungi.
