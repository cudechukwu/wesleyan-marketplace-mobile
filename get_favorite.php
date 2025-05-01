<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// 🔐 Ensure user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

$username = $_SESSION['username'];

// 🧠 Join with listings to get full details of favorited items
$stmt = $conn->prepare("
    SELECT l.id, l.username, l.item_name, l.description, l.price, l.created_at
    FROM favorites f
    JOIN listings l ON f.listing_id = l.id
    WHERE f.username = ?
    ORDER BY l.created_at DESC
");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $favorites]);
?>