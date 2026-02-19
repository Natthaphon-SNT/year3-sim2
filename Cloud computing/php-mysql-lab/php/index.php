<?php 
$host = 'db';
$user = 'labuser';
$pass = 'labpass';
$dbname = 'labdb';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>Connected successfully to the database.</h2>";
echo "<h1>Natthaphon Srinuta</h1>";
?>