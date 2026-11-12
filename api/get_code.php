<?php
// api/get_code.php - Hanya untuk development (Laragon)
// Mengembalikan kode verifikasi berdasarkan email
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
require_once __DIR__ . '/koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_GET;
}

$email = trim($data['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email wajib diisi.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT verification_code, is_verified FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Email tidak ditemukan.']);
        exit;
    }

    if ((int)$user['is_verified'] === 1) {
        echo json_encode(['success' => true, 'already_verified' => true, 'message' => 'Akun sudah terverifikasi.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'code' => $user['verification_code'],
        'message' => 'Kode verifikasi ditemukan.'
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
