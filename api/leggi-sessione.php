<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");



session_start();
if(!isset($_SESSION['token'])){
	http_response_code(401);
	echo "Utente non loggato";
	die();
}

echo("ciao");
http_response_code(200);

?>