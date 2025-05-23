<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION["username"])) {
    echo json_encode([]);
    exit();
}

$username = $_SESSION["username"];

// 🧠 Get unique conversation partners
$sql = "
    SELECT
        CASE
            WHEN sender_username = ? THEN receiver_username
            ELSE sender_username
        END AS chat_user,
        MAX(timestamp) AS last_time
    FROM messages
    WHERE sender_username = ? OR receiver_username = ?
    GROUP BY chat_user
    ORDER BY last_time DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $username, $username);
$stmt->execute();
$result = $stmt->get_result();

$conversations = [];

while ($row = $result->fetch_assoc()) {
    $chatUser = $row['chat_user'];

    $lastMsgStmt = $conn->prepare("
        SELECT sender_username, message, timestamp
        FROM messages
        WHERE (sender_username = ? AND receiver_username = ?)
           OR (sender_username = ? AND receiver_username = ?)
        ORDER BY timestamp DESC
        LIMIT 1
    ");
    $lastMsgStmt->bind_param("ssss", $username, $chatUser, $chatUser, $username);
    $lastMsgStmt->execute();
    $msgResult = $lastMsgStmt->get_result();
    $lastMessage = $msgResult->fetch_assoc();

    $conversations[] = [
        'username' => $chatUser,
        'last_message' => [
            'from' => $lastMessage['sender_username'],
            'text' => $lastMessage['message'],
            'timestamp' => $lastMessage['timestamp']
        ]
    ];
}

echo json_encode($conversations);
?>
