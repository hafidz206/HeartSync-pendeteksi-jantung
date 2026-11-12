<?php
// =====================================
// KONEKSI DATABASE HEARTSYNC
// =====================================

// Konfigurasi database
$host = "localhost";
$dbname = "heartsync_db";
$username = "root";
$password = ""; // Default Laragon biasanya kosong

try {
    // Membuat koneksi menggunakan PDO
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    // Mengaktifkan mode error PDO
    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    // Mengatur hasil query menjadi array asosiatif
    $pdo->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $e) {
    // Pesan umum, detail error tidak ditampilkan ke pengguna
    error_log("Koneksi database gagal: " . $e->getMessage());

    http_response_code(500);
    exit("Koneksi database gagal. Periksa konfigurasi server.");
}