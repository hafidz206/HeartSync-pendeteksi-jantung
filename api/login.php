<?php
// api/login.php
header('Content-Type: application/json');
require_once 'koneksi.php';

// Ambil data JSON dari request body
$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validasi input kosong
if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email dan kata sandi wajib diisi.'
    ]);
    exit;
}

try {
    // Cari pengguna berdasarkan email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Verifikasi user dan kecocokan password dengan hash di database
    if ($user && password_verify($password, $user['password'])) {
        // Cek apakah akun sudah diverifikasi
        if (isset($user['is_verified']) && (int)$user['is_verified'] !== 1) {
            echo json_encode([
                'success' => false,
                'is_verified' => false,
                'email' => $user['email'],
                'message' => 'Akun belum diverifikasi. Silakan masukkan kode verifikasi terlebih dahulu.'
            ]);
            exit;
        }

        // Login berhasil
        echo json_encode([
            'success' => true,
            'message' => 'Login berhasil.',
            'user' => [
                'id'    => $user['id'] ?? $user['user_id'] ?? null,
                'nama'  => $user['nama'],
                'name'  => $user['nama'],
                'email' => $user['email']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Email atau kata sandi salah.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
    ]);
}
?>
