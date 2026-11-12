<?php
// api/register.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$nama     = trim($data['nama']     ?? '');
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';

if (empty($nama) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Semua kolom wajib diisi.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Format email tidak valid.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Kata sandi minimal 6 karakter.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar.']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $verification_code = rand(10000, 99999);

    $stmt = $pdo->prepare(
        "INSERT INTO users (nama, email, password, verification_code, is_verified)
         VALUES (?, ?, ?, ?, 0)"
    );
    $stmt->execute([$nama, $email, $hashed_password, $verification_code]);

    @mail(
        $email,
        "Kode Verifikasi HeartSync",
        "Kode verifikasi Anda adalah: $verification_code",
        "From: no-reply@heartsync.com\r\nX-Mailer: PHP/" . phpversion()
    );

    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran berhasil. Silakan verifikasi akun.',
        'email'   => $email
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Kesalahan server: ' . $e->getMessage()]);
}
?>
