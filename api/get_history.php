<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

$email = trim($_GET['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email tidak disertakan.']);
    exit;
}

try {
    // Ambil riwayat pengukuran berdasarkan email atau user_id
    $stmtPengukuran = $pdo->prepare("
        SELECT 
            id,
            COALESCE(heart_rate, detak_jantung) AS heart_rate,
            status,
            tekanan_darah,
            gula_darah,
            berat_badan,
            created_at
        FROM pengukuran 
        WHERE email = ? OR user_id = (SELECT id FROM users WHERE email = ? LIMIT 1)
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $stmtPengukuran->execute([$email, $email]);
    $riwayatPengukuran = $stmtPengukuran->fetchAll(PDO::FETCH_ASSOC);

    // Ambil riwayat kuesioner berdasarkan email atau user_id
    $stmtQuiz = $pdo->prepare("
        SELECT 
            id,
            COALESCE(score, skor) AS score,
            COALESCE(result_text, tingkat_risiko) AS result_text,
            persentase,
            created_at
        FROM hasil_kuesioner 
        WHERE email = ? OR user_id = (SELECT id FROM users WHERE email = ? LIMIT 1)
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $stmtQuiz->execute([$email, $email]);
    $riwayatQuiz = $stmtQuiz->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'    => true,
        'pengukuran' => $riwayatPengukuran,
        'kuesioner'  => $riwayatQuiz
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal memuat data: ' . $e->getMessage()
    ]);
}
