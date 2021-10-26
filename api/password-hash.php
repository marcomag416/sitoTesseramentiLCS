<?php
$psw = $_GET['psw'];

echo "<h3>Hash generato per la password: $psw</h3>";
echo password_hash($psw, PASSWORD_DEFAULT);
?>