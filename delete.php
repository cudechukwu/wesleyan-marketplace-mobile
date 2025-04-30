<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// 🔒 Check if user is logged in
if (!isset($_SESSION["username"])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

// 📥 Get JSON input
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid listing ID.']);
    exit();
}

// 🔍 Check ownership
$stmt = $conn->prepare("SELECT username FROM listings WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Listing not found.']);
    exit();
}

$row = $result->fetch_assoc();
if ($row["username"] !== $_SESSION["username"]) {
    echo json_encode(['status' => 'error', 'message' => 'You do not have permission to delete this listing.']);
    exit();
}

// 🧹 Delete listing
$delete_stmt = $conn->prepare("DELETE FROM listings WHERE id = ?");
$delete_stmt->bind_param("i", $id);

if ($delete_stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Listing deleted successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error deleting listing.']);
}
?>
