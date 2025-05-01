<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// Ensure user is logged in
if (!isset($_SESSION["username"])) {
    echo json_encode([]);
    exit();
}

$username = $_SESSION["username"];
$otherUser = $_GET['user'] ?? '';

if (!$otherUser) {
    echo json_encode([]);
    exit();
}

$stmt = $conn->prepare("
    SELECT sender_username, message, timestamp
    FROM messages
    WHERE (sender_username = ? AND receiver_username = ?)
       OR (sender_username = ? AND receiver_username = ?)
    ORDER BY timestamp ASC
");
$stmt->bind_param("ssss", $username, $otherUser, $otherUser, $username);
$stmt->execute();
$result = $stmt->get_result();

$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = [
        'from' => $row['sender_username'] === $username ? 'me' : $row['sender_username'],
        'message' => $row['message'],
        'timestamp' => $row['timestamp']
    ];
}

echo json_encode($messages);
?>
