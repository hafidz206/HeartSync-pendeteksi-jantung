<?php
// api/admin_users.php — Daftar semua user (hanya untuk admin)
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . '/koneksi.php';

try {
    // GET: ambil daftar user
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, nama, email, role, is_verified, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        echo json_encode(['success' => true, 'users' => $users]);
        exit;
    }

    // POST: update role user
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = (int)($data['user_id'] ?? 0);
        $newRole = $data['role'] ?? '';

        if (!$userId || !in_array($newRole, ['admin', 'user'])) {
            echo json_encode(['success' => false, 'message' => 'Parameter tidak valid.']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$newRole, $userId]);
        echo json_encode(['success' => true, 'message' => 'Role berhasil diperbarui.']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Method tidak didukung.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error DB: ' . $e->getMessage()]);
}
