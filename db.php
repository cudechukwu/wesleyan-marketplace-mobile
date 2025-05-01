<?php
$host = "127.0.0.1";

$user = "root";         // default user for XAMPP
$pass = "";             // default has no password
$dbname = "app_db"; // use the name of your local database

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

