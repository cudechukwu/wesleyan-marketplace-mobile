<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');

include 'db.php';

$result = $conn->query("SELECT * FROM listings ORDER BY id DESC");
$listings = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $listings[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $listings]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch listings.']);
}
?>
