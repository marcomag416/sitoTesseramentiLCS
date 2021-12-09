<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../bootstrap.php";
require_once "../src/system/sessionCheck.php";
require_once "../src/tesserati/tesserati.php";
require_once "../src/tesserati/certificati.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

//print_r ($uri);

if($uri[1] == 'login'){
	require("../src/login/login.php");
	exit();
}

if($uri[1] == "prova"){
	echo date("Europe");
	echo " | Connectivity test ok";
	exit();
}

/*if(isset($_POST['token'])){
	echo json_encode(array("status" => false, "msg" => $_POST['token']));
	http_response_code(202);
	exit();
}*/
http_response_code(200);
/*LOGGED IN CONTROLS*/
//$token = '$2y$10$AvFoIBsxOY2aBspfAzD2tuYfkwCAod3xU0CGDN4nlyecpf6XQVdMG';
$token = leggiToken();
if($token == false){
	echo json_encode(array("status" => false, "msg" => "Token mancante"));
	//http_response_code(400);
	exit();
}

if($uri[1] == 'deleteSession'){
	deleteSession($token, $dbConnection);
	exit();
}


$session = sessionCheck($token, $dbConnection);

if($uri[1] == 'sessionCheck'){
	echo json_encode($session);
	exit();
}

if($session['status'] == false){
	echo json_encode(array("status" => false, "msg" =>"Sessione scaduta"));
	exit();
}
/*LOGGED IN FUNCTIONS*/

if($uri[1] == 'elencoTesserati'){
	//echo json_encode(leggiTesserati($session['squadra'], $session['stagione'], $dbConnection));
	echo json_encode(leggiTesserati($token, $dbConnection));
	exit();
}

if($uri[1] == 'uploadGiocatore'){
	echo json_encode(uploadGiocatore($session, $dbConnection));
	exit();
}

if($uri[1] == 'deleteGiocatore'){
	echo json_encode(deleteGiocatore($session, $dbConnection));
	exit();
}

if($uri[1] == 'uploadCertificatoDati'){
	echo json_encode(uploadCertificatoDati($session, $dbConnection));
}

if($uri[1] == 'uploadCertificatoId'){
	echo json_encode(uploadCertificatoId($session, $dbConnection));
}

if($uri[1] == 'updateGiocatore'){
	echo json_encode(updateGiocatore($session, $dbConnection));
}

?>