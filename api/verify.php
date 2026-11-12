<?php
// api/verify.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$email = trim($data['email'] ?? '');
$code  = trim($data['code']  ?? '');

if (empty($email) || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Email dan kode verifikasi wajib diisi.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND verification_code = ?");
    $stmt->execute([$email, $code]);
    $user = $stmt->fetch();

    if ($user) {
        $update = $pdo->prepare("UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?");
        $update->execute([$email]);

        echo json_encode([
            'success' => true,
            'message' => 'Akun berhasil diverifikasi!',
            'user'    => [
                'id'    => $user['id'],
                'nama'  => $user['nama'],
                'name'  => $user['nama'],
                'email' => $user['email']
            ]
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
