<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$email       = trim($data['email'] ?? '');
$score       = isset($data['score']) ? (int)$data['score'] : 0;
$result_text = trim($data['result_text'] ?? '');

if (empty($email)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Sesi tidak valid. Email tidak ditemukan.'
    ]);
    exit;
}

try {
    // Cari user_id jika user sudah terdaftar di users table
    $stmtUser = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch();
    $userId = $user ? $user['id'] : null;

    $tingkatRisiko = null;
    $validRisiko = ['rendah', 'sedang', 'tinggi', 'terdiagnosa'];
    $lowerText = strtolower($result_text);
    if (in_array($lowerText, $validRisiko)) {
        $tingkatRisiko = $lowerText;
    }

    $stmt = $pdo->prepare("
        INSERT INTO hasil_kuesioner (
            user_id, email, skor, score, tingkat_risiko, result_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $userId,
        $email,
        $score,
        $score,
        $tingkatRisiko,
        $result_text
    ]);

    echo json_encode([
        'success' => true, 
        'message' => 'Hasil kuesioner berhasil disimpan ke database!'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
