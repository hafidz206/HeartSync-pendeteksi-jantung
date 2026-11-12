<?php
// =====================================
// KONEKSI DATABASE HEARTSYNC
// =====================================

$host     = "localhost";
$dbname   = "heartsync_db";
$username = "root";
$password = ""; // Default Laragon biasanya kosong

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    error_log("Koneksi database gagal: " . $e->getMessage());

    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal. Pastikan MySQL di Laragon aktif.'
    ]);
    exit;
}
