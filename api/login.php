<?php
// api/login.php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/koneksi.php';

// Ambil input JSON atau POST
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email dan kata sandi wajib diisi.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        if (isset($user['is_verified']) && (int)$user['is_verified'] !== 1) {
            echo json_encode([
                'success'     => false,
                'is_verified' => false,
                'email'       => $user['email'],
                'message'     => 'Akun belum diverifikasi. Silakan masukkan kode verifikasi terlebih dahulu.'
            ]);
            exit;
        }

        // Cek apakah pengguna sudah pernah mengisi kuesioner
        $stmtQuiz = $pdo->prepare("
            SELECT id FROM hasil_kuesioner 
            WHERE email = ? OR user_id = ? 
            LIMIT 1
        ");
        $stmtQuiz->execute([$user['email'], $user['id']]);
        $hasQuiz = $stmtQuiz->fetch() ? true : false;

        // Pembeda role adalah email (domain @heartsync.com = admin, lainnya = user)
        $userRole = (stripos($user['email'], '@heartsync.com') !== false || ($user['role'] ?? '') === 'admin') ? 'admin' : 'user';

        echo json_encode([
            'success'  => true,
            'message'  => 'Login berhasil.',
            'has_quiz' => $hasQuiz,
            'user'     => [
                'id'    => $user['id'] ?? null,
                'nama'  => $user['nama'],
                'name'  => $user['nama'],
                'email' => $user['email'],
                'role'  => $userRole
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
