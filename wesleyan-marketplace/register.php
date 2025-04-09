<?php
session_start();
include 'db.php';

header("Content-Type: application/json");

// Get raw input if JSON is sent
$input = json_decode(file_get_contents("php://input"), true);

$username = trim($input["username"] ?? '');
$password = $input["password"] ?? '';
$confirm_password = $input["confirm_password"] ?? '';

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $response = ["status" => "error", "message" => "All fields are required."];
    } elseif (strlen($password) < 10) {
        $response = ["status" => "error", "message" => "Password must be at least 10 characters long."];
    } elseif ($password !== $confirm_password) {
        $response = ["status" => "error", "message" => "Passwords do not match."];
    } else {
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $response = ["status" => "error", "message" => "Username already exists."];
        } else {
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $hashed_password);

            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Registration successful!"];
            } else {
                $response = ["status" => "error", "message" => "Registration failed. Please try again."];
            }
        }
    }
} else {
    $response = ["status" => "error", "message" => "Invalid request method."];
}

echo json_encode($response);
exit();
?>
