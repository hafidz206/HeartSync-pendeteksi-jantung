<?php
// api/register.php
header('Content-Type: application/json');
require_once 'koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

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

try {
    // Cek email duplikat
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar.']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Buat kode verifikasi acak 5-digit
    $verification_code = rand(10000, 99999);

    // Simpan ke database dengan is_verified = 0
    $stmt = $pdo->prepare(
        "INSERT INTO users (nama, email, password, verification_code, is_verified)
         VALUES (?, ?, ?, ?, 0)"
    );
    $stmt->execute([$nama, $email, $hashed_password, $verification_code]);

    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran berhasil. Silakan verifikasi akun.',
        'email'   => $email
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Kesalahan server: ' . $e->getMessage()]);
}
?>
