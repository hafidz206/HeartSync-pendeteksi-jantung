<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$email      = trim($data['email'] ?? '');
$heart_rate = isset($data['heart_rate']) ? (int)$data['heart_rate'] : (isset($data['hr']) ? (int)$data['hr'] : 0);
$status     = trim($data['status'] ?? '');

$bp = $data['tekanan_darah'] ?? ($data['bp'] ?? null);
$gl = isset($data['gula_darah']) ? (int)$data['gula_darah'] : (isset($data['gl']) ? (int)$data['gl'] : null);
$wt = isset($data['berat_badan']) ? (float)$data['berat_badan'] : (isset($data['wt']) ? (float)$data['wt'] : null);

if (empty($email) || $heart_rate <= 0) {
    echo json_encode([
        'success' => false, 
        'message' => 'Data pengukuran tidak lengkap atau tidak valid.'
    ]);
    exit;
}

try {
    // Cari user_id jika user sudah terdaftar di users table
    $stmtUser = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch();
    $userId = $user ? $user['id'] : null;

    $stmt = $pdo->prepare("
        INSERT INTO pengukuran (
            user_id, email, detak_jantung, heart_rate, tekanan_darah, gula_darah, berat_badan, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $userId,
        $email,
        $heart_rate,
        $heart_rate,
        $bp,
        $gl,
        $wt,
        $status
    ]);

    echo json_encode([
        'success' => true, 
        'message' => 'Data detak jantung berhasil dicatat!'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
