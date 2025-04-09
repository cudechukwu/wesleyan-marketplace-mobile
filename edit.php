<?php
session_start();
include 'db.php';

// Ensure user is logged in
if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit();
}

// Check if ID is provided in the URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Invalid listing ID.");
}

$id = $_GET['id'];

// Fetch listing data
$stmt = $conn->prepare("SELECT * FROM listings WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Listing not found.");
}

$row = $result->fetch_assoc();

// Check if the logged-in user is the owner
if ($row["username"] !== $_SESSION["username"]) {
    die("You do not have permission to edit this listing.");
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $item_name = $_POST["item_name"];
    $description = $_POST["description"];
    $price = $_POST["price"];

    // Update the database
    $update_stmt = $conn->prepare("UPDATE listings SET item_name = ?, description = ?, price = ? WHERE id = ?");
    $update_stmt->bind_param("ssdi", $item_name, $description, $price, $id);

    if ($update_stmt->execute()) {
        header("Location: index.php");
        exit();
    } else {
        echo "Error updating listing.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Listing</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Edit Listing</h1>
        <nav><a href="index.php">Home</a> | <a href="logout.php">Logout</a></nav>
    </header>

    <form action="edit.php?id=<?php echo $id; ?>" method="POST">
        <input type="text" name="item_name" value="<?php echo $row['item_name']; ?>" required>
        <textarea name="description" required><?php echo $row['description']; ?></textarea>
        <input type="number" step="0.01" name="price" value="<?php echo $row['price']; ?>" required>
        <button type="submit">Update Listing</button>
    </form>
</body>
</html>
