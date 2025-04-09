<?php
session_start();
include 'db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wesleyan Marketplace</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><a href="index.html">College Marketplace</a></h1>
        <nav>
            <?php if (isset($_SESSION["username"])): ?>
                <a href="create.php">Create Listing</a>
                <a href="logout.php">Logout</a>
            <?php else: ?>
                <a href="register.php">Register</a>
                <a href="login.php">Login</a>
            <?php endif; ?>
        </nav>
    </header>

    <!-- ✅ Logged-in user message placed here (inside body) -->
    <?php if (isset($_SESSION["username"])): ?>
        <div class="user-info">
            Logged in as: <strong><?= htmlspecialchars($_SESSION["username"]) ?></strong>
        </div>
    <?php endif; ?>

    <section class="listings">
        <h2>All Listings</h2>

        <?php
        $stmt = $conn->prepare("SELECT * FROM listings ORDER BY id DESC");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0):
            while ($row = $result->fetch_assoc()):
        ?>
                <div class="listing">
                    <!-- Item Title -->
                    <a href="#" class="listing-title">
                        <h3><?= htmlspecialchars($row['item_name']) ?></h3>
                    </a>

                    <!-- Description -->
                    <div class="listing-description">
                        <p><?= htmlspecialchars($row['description']) ?></p>
                        <p class="price"><strong>$<?= number_format($row['price'], 2) ?></strong></p>
                    </div>

                    <!-- Seller -->
                    <p class="seller">Listed by: <?= htmlspecialchars($row['username']) ?></p>

                    <!-- Actions (Only for Owner) -->
                    <?php if ($_SESSION["username"] === $row["username"]): ?>
                        <div class="listing-actions">
                            <a href="edit.php?id=<?= $row['id'] ?>" class="edit-btn">Edit</a>
                            <a href="delete.php?id=<?= $row['id'] ?>" class="delete-btn" onclick="return confirm('Are you sure you want to delete this listing?');">Delete</a>
                        </div>
                    <?php endif; ?>
                </div>
        <?php
            endwhile;
        else:
            echo "<p>No listings available.</p>";
        endif;
        ?>
    </section>
</body>
</html>
