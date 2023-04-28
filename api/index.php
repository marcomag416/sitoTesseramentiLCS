<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "./bootstrap.php";
require_once "./src/system/sessionCheck.php";
require_once "./src/tesserati/tesserati.php";
require_once "./src/tesserati/certificati.php";
require_once "./src/dirigenti/dirigenti.php";
require_once "./src/amministratori/amministratori.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );
$cmd = $uri[1];
/* $uritest = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
echo $uritest;
echo $cmd;
exit(); */

http_response_code(200);

//print_r ($uri);

if($cmd == 'login'){
	require("./src/login/login.php");
	exit();
}

if($cmd == "prova"){
	echo date("Europe");
	echo " | Connectivity test ok";
	exit();
}

/*if($cmd == "ideapadz510"){
	$filelog = fopen("log_attivazione.txt", "a");
	$logtxt = "-------------\nSessione attivazione account: ".date("Europe")."\n\n";
	fwrite($filelog, $logtxt);
	$sql = "SELECT amm.id as id, amm.mail as mail FROM amministratori amm WHERE amm.id_stagione = :idstag and amm.psw = :pswprov;";
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idstag", 4, PDO::PARAM_INT);
	$stm->bindValue(":pswprov", "attpsw", PDO::PARAM_STR);
	$stm->execute();
	while( $row = $stm->fetch(PDO::FETCH_ASSOC)){
		$code = creaCodiceRipristino($row['id'], 15, $dbConnection);
		$link = "https://tesseramenti.molecup.com/psw-reset/$code";
		echo ($row['mail']."  ".$link."\n");
		fwrite($filelog, $row['mail']."  ".$link."\n");
		$to = $row['mail'];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=iso-8859-1';
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        $headers[] = 'From: LCS staff <noreply@legacalciostudenti.com>';
        $headers[] = 'Reply-To: <gastoneemprin03@gmail.com>';
        $subject = "Attivazione account";
        $message = file_get_contents(ROOTPATH."/src/mailMessages/attivazioneAccount.html");
        $message = str_replace(":link", $link, $message);
        $message = wordwrap($message, 70, "\r\n");
        if(mail($to, $subject, $message, implode("\r\n", $headers))){
            echo "Mail di attivazione inviata con  successo a $to\n";
			fwrite($filelog, "Mail di attivazione inviata con  successo a $to\n");
        }
        else{
            echo "--ERRORE invio mail di attivazione a $to\n";
			fwrite($filelog, "--ERRORE invio mail di attivazione a $to\n");
        }
	}
	fwrite($filelog, "\n");
	fclose($filelog);
	exit();
}*/

if($cmd == "resetPsw"){
	echo json_encode(resetPsw($dbConnection));
	exit();
}

if($cmd == "recoverPsw"){
	echo json_encode(recoverPsw($dbConnection));
	exit();
}

/*if(isset($_POST['token'])){
	echo json_encode(array("status" => false, "msg" => $_POST['token']));
	http_response_code(202);
	exit();
}*/
http_response_code(200);
/*LOGGED IN CONTROLS*/
$token = leggiToken();
//$token = '$2y$10$Pm9njMM9wb23t5hYsQsyEeoAQVcOu24vgqqafMNEDIC2ZlPHp.cQS';
if($token == false){
	echo json_encode(array("status" => false, "msg" => "Token mancante"));
	//http_response_code(400);
	exit();
}

if($cmd == 'deleteSession'){
	deleteSession($token, $dbConnection);
	exit();
}


$session = sessionCheck($token, $dbConnection);

if($cmd == 'sessionCheck'){
	echo json_encode($session);
	exit();
}

if($session['status'] == false){
	echo json_encode(array("status" => false, "msg" =>"Sessione scaduta"));
	exit();
}
/*LOGGED IN FUNCTIONS*/

if($cmd == 'elencoTesserati'){
	//echo json_encode(leggiTesserati($session['squadra'], $session['stagione'], $dbConnection));
	echo json_encode(leggiTesserati($token, $dbConnection));
	exit();
}

if($cmd == 'uploadGiocatore'){
	echo json_encode(uploadGiocatore($session, $dbConnection));
	exit();
}

if($cmd == 'deleteGiocatore'){
	echo json_encode(deleteGiocatore($session, $dbConnection));
	exit();
}

if($cmd == 'uploadCertificatoDati'){
	echo json_encode(uploadCertificatoDati($session, $dbConnection));
}

if($cmd == 'uploadCertificatoId'){
	echo json_encode(uploadCertificatoId($session, $dbConnection));
}

if($cmd == 'updateGiocatore'){
	echo json_encode(updateGiocatore($session, $dbConnection));
}

if($cmd == 'deleteDirigente'){
	echo json_encode(deleteDirigente($session, $dbConnection));
}

if($cmd == 'elencoDirigenti'){
	echo json_encode(leggiDirigenti($token, $dbConnection));
}

if($cmd == 'uploadDirigente'){
	echo json_encode(uploadDirigente($session, $dbConnection));
}

if($cmd == 'updatePassword'){
	echo json_encode(updatePsw($session, $dbConnection));
}

if($cmd == 'inviaElenco'){
	echo json_encode(inviaElenco($session, $dbConnection));
}

if($cmd == 'cambiaSquadra'){
	echo json_encode(cambiaSquadra($session, $dbConnection));
}

if($cmd == 'elencoSquadre'){
	echo json_encode(elencoSquadre($session, $dbConnection));
}

?>