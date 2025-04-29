<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// 🧾 Get the JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Determine the sender (prefer session, allow override for testing)
$sender = $_SESSION["username"] ?? $data["sender"] ?? null;
$receiver = trim($data['receiver'] ?? '');
$message  = trim($data['message'] ?? '');

// 🔐 Basic validation
if (!$sender || !$receiver || !$message) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing sender, receiver, or message.'
    ]);
    exit();
}

// 💾 Insert the message into the database
$stmt = $conn->prepare("INSERT INTO messages (sender_username, receiver_username, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $sender, $receiver, $message);

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Message sent successfully.',
        'sender' => $sender,
        'receiver' => $receiver
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send message.'
    ]);
}
?>
