<?php
require_once 'src\system\databaseConnector.php';


define("DB_HOST", "localhost");
define("DB_PORT", "3306");
define("DB_DATABASE", "tesserati_mole_league");
define("DB_USERNAME", "utente1");
define("DB_PASSWORD", "mkhLDgM4_ATU_iEa");

use src\system\databaseConnector as databaseConnector;
$dbConnection = (new databaseConnector())->getConnection();

?>