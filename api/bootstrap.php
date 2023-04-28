<?php
require_once 'src/system/databaseConnector.php';
define('ROOTPATH', __DIR__);
define('MAX_FILE_SIZE', 4194304); /* 4MB */


define("DB_HOST", "localhost");
define("DB_PORT", "3306");
define("DB_DATABASE", "molecup1_appTesseramenti");
define("DB_USERNAME", "molecup1_appTesseramenti");
define("DB_PASSWORD", "XBuw+f^W^=VkYeH,=d");

use src\system\databaseConnector as databaseConnector;
$dbConnection = (new databaseConnector())->getConnection();

?>