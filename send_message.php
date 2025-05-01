<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// 🔒 Ensure the user is logged in
if (!isset($_SESSION["username"])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit();
}

// ✅ Read and decode raw JSON from the request body
$data = json_decode(file_get_contents('php://input'), true);

$sender = $_SESSION["username"];
$receiver = $data['receiver'] ?? '';
$message = $data['message'] ?? '';

if (!$receiver || !$message) {
    echo json_encode(['status' => 'error', 'message' => 'Missing fields']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO messages (sender_username, receiver_username, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $sender, $receiver, $message);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send message']);
}
?>
