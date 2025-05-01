<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db.php';
header('Content-Type: application/json');

// Debug incoming data
file_put_contents('debug_POST.log', print_r($_POST, true));
file_put_contents('debug_FILES.log', print_r($_FILES, true));

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"] ?? null;
    $item_name = $_POST["item_name"] ?? null;
    $description = $_POST["description"] ?? null;
    $price = $_POST["price"] ?? null;

    $missingFields = [];
    if (!$username) $missingFields[] = 'username';
    if (!$item_name) $missingFields[] = 'item_name';
    if (!$description) $missingFields[] = 'description';
    if (!$price) $missingFields[] = 'price';

    if (!empty($missingFields)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing fields: ' . implode(', ', $missingFields)
        ]);
        exit;
    }

    if (!is_numeric($price)) {
        echo json_encode(['status' => 'error', 'message' => 'Price must be numeric.']);
        exit;
    }

    // Upload images (optional)
    $imagePaths = [];
    for ($i = 1; $i <= 3; $i++) {
        $key = "image$i";
        if (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
            $tmp = $_FILES[$key]['tmp_name'];
            $original = basename($_FILES[$key]['name']);
            $unique = uniqid("img_") . "_" . $original;
            $target = "uploads/" . $unique;

            if (move_uploaded_file($tmp, $target)) {
                $imagePaths[] = $unique;  // just filename
            } else {
                $imagePaths[] = null;
            }
        } else {
            $imagePaths[] = null;
        }
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO listings (username, item_name, description, price, image1, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdsss", $username, $item_name, $description, $price, $imagePaths[0], $imagePaths[1], $imagePaths[2]);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Listing created successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }

    exit;
}
?>
