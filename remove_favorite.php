<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION["username"])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $_SESSION["username"];
$listing_id = $data['listing_id'] ?? null;

if (!$listing_id) {
    echo json_encode(["status" => "error", "message" => "Missing listing_id"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM favorites WHERE username = ? AND listing_id = ?");
$stmt->bind_param("si", $username, $listing_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Removed from favorites"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to remove"]);
}
?>
