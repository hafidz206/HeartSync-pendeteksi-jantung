<?php
// api/verify.php
header('Content-Type: application/json');
require_once 'koneksi.php';

$data  = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$code  = trim($data['code']  ?? '');

if (empty($email) || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Email dan kode verifikasi wajib diisi.']);
    exit;
}

try {
    // Cek apakah email dan kodenya cocok
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND verification_code = ?");
    $stmt->execute([$email, $code]);
    $user = $stmt->fetch();

    if ($user) {
        // Jika cocok, ubah status jadi terverifikasi (1) dan kosongkan kolom kode
        $update = $pdo->prepare(
            "UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?"
        );
        $update->execute([$email]);

        echo json_encode([
            'success' => true,
            'message' => 'Akun berhasil diverifikasi!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Kode verifikasi salah atau tidak valid.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Kesalahan server: ' . $e->getMessage()]);
}
?>
