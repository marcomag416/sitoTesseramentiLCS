<?php
/*header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,POST,HEADERS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../../bootstrap.php";*/

$rest_json = file_get_contents("php://input");
$input = json_decode($rest_json, true);

if (empty($input['mail']) && empty($input['psw'])){
	http_response_code(200);
	die();
}
http_response_code(200);

$stm = $dbConnection -> prepare("SELECT id, psw FROM `amministratori` WHERE mail = ?");
$stm->bindParam(1, $input['mail']);
$stm->execute();

if($stm->rowCount() != 1){
	echo json_encode(array("status" => false, "msg" => "Utente non trovato"));
}
else{
	$utente = $stm->fetch(PDO::FETCH_ASSOC);

	if(password_verify($input['psw'], $utente['psw'])){
		$raw_token = $utente['id'].$input['mail'].strval(time()).random_bytes(16);
		$token = password_hash($raw_token, PASSWORD_DEFAULT);

		$stm2 = $dbConnection -> prepare("INSERT INTO `sessioni` (`token`, `id_amministratore`, `ultimo_accesso`) VALUES (:token, :admin, current_timestamp());");
		$stm2->bindValue(':token', $token);
		$stm2->bindValue(':admin', $utente['id']);
		$stm2->execute();
		echo json_encode(array("status" => true, "token" => $token, "userid" => $utente['id']));
	}
	else{
		echo json_encode(array("status" => false, "msg" => "Password errata"));
	}
}
?>