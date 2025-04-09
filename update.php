<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

// 🔒 Ensure the user is logged in
if (!isset($_SESSION["username"])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

// 📦 Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// 🧪 Validate input fields
$id = $data['id'] ?? null;
$item_name = trim($data['item_name'] ?? '');
$description = trim($data['description'] ?? '');
$price = $data['price'] ?? null;
$username = $_SESSION["username"];

if (!$id || !$item_name || !$description || !$price) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit();
}

if (!is_numeric($price) || $price <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid price.']);
    exit();
}

// 🛠️ Update listing only if it belongs to the logged-in user
$stmt = $conn->prepare("UPDATE listings SET item_name=?, description=?, price=? WHERE id=? AND username=?");
$stmt->bind_param("ssdss", $item_name, $description, $price, $id, $username);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Listing updated successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Update failed.']);
}
?>
