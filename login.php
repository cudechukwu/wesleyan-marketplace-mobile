<?php
session_start();
include 'db.php';

header("Content-Type: application/json");

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data["username"] ?? "";
    $password = $data["password"] ?? "";

    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
        $_SESSION["username"] = $username;
        $response = ["status" => "success", "message" => "Login successful!", "username" => $username];
    } else {
        $response = ["status" => "error", "message" => "Invalid username or password."];
    }
} else {
    $response = ["status" => "error", "message" => "Invalid request method."];
}

echo json_encode($response);
exit();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Wesleyan Marketplace</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><a href="index.html">College Marketplace</a></h1>
        <nav>
            <a href="index.html">Home</a>
            <a href="register.php">Register</a>
        </nav>
    </header>

    <section class="form-container">
        <h2>Login</h2>
        <form action="login.php" method="POST">
            <input type="text" name="username" placeholder="Enter Username" required>
            <input type="password" name="password" placeholder="Enter Password" required>
            <button type="submit">Login</button>
        </form>
    </section>
</body>
</html>

