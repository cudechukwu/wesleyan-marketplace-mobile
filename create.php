<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db.php';
header('Content-Type: application/json');

// Handle API submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data["username"] ?? null;
    $item_name = $data["item_name"] ?? null;
    $description = $data["description"] ?? null;
    $price = $data["price"] ?? null;

    // Validate inputs
    $missingFields = [];
    if (empty($username)) $missingFields[] = 'username';
    if (empty($item_name)) $missingFields[] = 'item_name';
    if (empty($description)) $missingFields[] = 'description';
    if (empty($price)) $missingFields[] = 'price';

    if (!empty($missingFields)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing fields: ' . implode(', ', $missingFields)
        ]);
        exit();
    } elseif (!is_numeric($price) || $price <= 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Price must be a valid number.'
        ]);
        exit();
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO listings (username, item_name, description, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $username, $item_name, $description, $price);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Listing created successfully.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $stmt->error
        ]);
    }
    exit();
}

// If not a POST request (e.g., browser access), show form
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Create Listing | Wesleyan Marketplace</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1>Wesleyan Marketplace</h1>
    <nav>
      <a href="index.php">Home</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>

  <section class="form-container">
    <h2>Create a New Listing</h2>
    <?php if (!empty($error_message)): ?>
      <p class="error"><?php echo $error_message; ?></p>
    <?php endif; ?>
    <form action="create.php" method="POST">
      <input type="text" name="item_name" placeholder="Item Name" required>
      <textarea name="description" placeholder="Description" required></textarea>
      <input type="number" step="0.01" name="price" placeholder="Price" required>
      <button type="submit">Create Listing</button>
    </form>
  </section>
</body>
</html>
`