<?php
function contaTesserati($session, $dbConnection){
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/contGiocatori.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
	$stm->bindValue(":idstagione", $session['idstagione'], PDO::PARAM_INT);
	$stm->execute();

	if($stm->rowCount() == 0){
		return 0;
	}
	$row = $stm->fetch(PDO::FETCH_ASSOC);
	return $row['cont'];
}

function leggiTesserati($token, $dbConnection){
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/selectGiocatori.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":token", $token, PDO::PARAM_STR);
	$stm->execute();

	if($stm -> rowCount() == 0){
		return array("status" => false, "msg" => "Nessun giocatore trovato");
	}
	$cont = 0;
	while( $row = $stm->fetch(PDO::FETCH_ASSOC)){
		//$row['certificato'] = controllaScadenza($row['scadenza'], $row['fisico']);
		/*$date = new DateTime($row['scadenza']);
		$row['scadenza'] = date_timestamp_get($date);*/
		$result[$cont++] = $row;
	}
	return array("status" => true, "vett" => $result);
	
}

function deleteGiocatore($session, $dbConnection){
	if(!isset($_POST['idgiocatore'])){
		return array("status" => false, "msg" => "id giocatore non trovato");
	}
	if($session['elInviato']){
		return array("status" => false, "msg" => "impossibile modificare un elenco tesserati inviato");
	}
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/moveGiocatoreToBin.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idgiocatore", $_POST['idgiocatore'], PDO::PARAM_STR);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_STR);
	$stm->execute();
	return array("status" => true, "msg" => "Giocatore spostato nel cestino");
}

//function aggiungiGiocatore($token, )

function controllaScadenza($scad, $cart){
	$scadenza = explode("-", $scad);
	if(date("ymd") > "$scadenza[0]$scadenza[1]".($scadenza[2] + 15) && date("ymd") < "$scadenza[0]$scadenza[1]".($scadenza[2] - 15)){
		return 2;
	}
	else if(date("ymd") > "$scadenza[0]$scadenza[1]".($scadenza[2] + 10)){
		return 3;
	}
	else if(date("ymd") < "$scadenza[0]$scadenza[1]$scadenza[2]"){
		if($cart){
			return 0;
		}
		return 1;
	} 
}

function updateGiocatore($session, $dbConnection){
	if($session['elInviato']){
		return array("status" => false, "msg" => "impossibile modificare un elenco tesserati inviato");
	}
	/* controllo campi */
	if(!isset($_POST['idgiocatore']) || !isset($_POST['cf']) || !isset($_POST['nome']) ||!isset($_POST['cognome']) || !isset($_POST['data_nascita']) || !isset($_POST['classe']) || !isset($_POST['luogo_nascita'])){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	if($_POST['idgiocatore'] == "" || $_POST['cf'] == "" || $_POST['nome'] == "" || $_POST['cognome'] == "" || $_POST['classe'] == "" || $_POST['luogo_nascita'] == ""){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	$_POST['cf'] = strtoupper($_POST['cf']);
	if(!controlloCodiceFiscale($_POST['cf'])){
		return array("status" => false, "msg" => "Codice fiscale non valido");
	}

	if(!isset($_POST['numero']) && (!is_numeric($_POST['numero']) || $_POST['numero'] > 99 || $_POST['numero'] < 1)){
		return array("status" => false, "msg" => "Numero di maglia non valido");
	}
	if($_POST['numero'] == ""){
		$_POST['numero'] = null;
	}
	else{
		$_POST['numero'] = (int)$_POST['numero'];
	}

	$_POST['taglia'] = strtoupper($_POST['taglia']);
	if(!isset($_POST['taglia']) && !controllaTaglia($_POST['taglia'])){
		return array("status" => false, "msg" => "Taglia non valida");
	}

	$_POST['luogo_nascita'] = ucwords(strtolower($_POST['luogo_nascita']));
	$_POST['nome'] = ucwords(strtolower($_POST['nome']));
	$_POST['cognome'] = ucwords(strtolower($_POST['cognome']));
	$_POST['classe'] = strtoupper($_POST['classe']);

	$_POST['ruolo'] = ucfirst(strtolower($_POST['ruolo']));
	if(!isset($_POST['ruolo']) && !controllaRuolo($_POST['ruolo'])){
		return array("status" => false, "msg" => "Ruolo giocatore non valido");
	}

	$_POST['data_nascita'] = str_replace("/", "-", $_POST['data_nascita']);
	$_POST['data_nascita'] = str_replace("\\", "-", $_POST['data_nascita']);
	if(!ControlloData($_POST['data_nascita'])){
		return array("status" => false, "msg" => "Data di nascita non valida");
	}

	if(strlen($_POST['classe']) > 8){
		return array("status" => false, "msg" => "Classe non valida");
	}

	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/updateGiocatore.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idgiocatore", $_POST['idgiocatore'], PDO::PARAM_INT);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
	$stm->bindValue(":cf", $_POST['cf'], PDO::PARAM_STR);
	$stm->bindValue(":nome", $_POST['nome'], PDO::PARAM_STR);
	$stm->bindValue(":cognome", $_POST['cognome'], PDO::PARAM_STR);
	$stm->bindValue(":classe", $_POST['classe'], PDO::PARAM_STR);
	$stm->bindValue(":numero", $_POST['numero'], PDO::PARAM_INT);
	$stm->bindValue(":taglia", $_POST['taglia'], PDO::PARAM_STR);
	$stm->bindValue(":ruolo", $_POST['ruolo'], PDO::PARAM_STR);
	$stm->bindValue(":luogo_nascita", $_POST['luogo_nascita'], PDO::PARAM_STR);
	$stm->bindValue(":data_nascita", $_POST['data_nascita'], PDO::PARAM_STR);
	try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql : $errmsg");
	}
	$lastId = $dbConnection->lastInsertId();

	return array("status" => true, "msg" => "Giocatore inserito", "idgiocatore" => $lastId);
}

function uploadGiocatore($session, $dbConnection){
	if($session['elInviato']){
		return array("status" => false, "msg" => "impossibile modificare un elenco tesserati inviato");
	}
	/* controllo campi */
	if(!isset($_POST['cf']) || !isset($_POST['nome']) ||!isset($_POST['cognome']) || !isset($_POST['data_nascita']) || !isset($_POST['classe']) || !isset($_POST['luogo_nascita'])){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	if($_POST['cf'] == "" || $_POST['nome'] == "" || $_POST['cognome'] == "" || $_POST['classe'] == "" || $_POST['luogo_nascita'] == ""){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	$_POST['cf'] = strtoupper($_POST['cf']);
	if(!controlloCodiceFiscale($_POST['cf'])){
		return array("status" => false, "msg" => "Codice fiscale non valido");
	}

	if(!isset($_POST['numero']) && (!is_numeric($_POST['numero']) || $_POST['numero'] > 99 || $_POST['numero'] < 1)){
		return array("status" => false, "msg" => "Numero di maglia non valido");
	}
	if($_POST['numero'] == ""){
		$_POST['numero'] = null;
	}
	else{
		$_POST['numero'] = (int)$_POST['numero'];
	}

	$_POST['taglia'] = strtoupper($_POST['taglia']);
	if(!isset($_POST['taglia']) && !controllaTaglia($_POST['taglia'])){
		return array("status" => false, "msg" => "Taglia non valida");
	}

	$_POST['luogo_nascita'] = ucwords(strtolower($_POST['luogo_nascita']));
	$_POST['nome'] = ucwords(strtolower($_POST['nome']));
	$_POST['cognome'] = ucwords(strtolower($_POST['cognome']));
	$_POST['classe'] = strtoupper($_POST['classe']);

	$_POST['ruolo'] = ucfirst(strtolower($_POST['ruolo']));
	if(!isset($_POST['ruolo']) && !controllaRuolo($_POST['ruolo'])){
		return array("status" => false, "msg" => "Ruolo giocatore non valido");
	}

	if(!ControlloData($_POST['data_nascita'])){
		return array("status" => false, "msg" => "Data di nascita non valida");
	}

	if(strlen($_POST['classe']) > 8){
		return array("status" => false, "msg" => "Classe non valida");
	}

	if(contaTesserati($session, $dbConnection) >= 20){
		return array("status" => false, "msg" => "Raggiunto il numero massimo di giocatori");
	}


	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/insertGiocatori.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
	$stm->bindValue(":idstagione", $session['idstagione'], PDO::PARAM_INT);
	$stm->bindValue(":cf", $_POST['cf'], PDO::PARAM_STR);
	$stm->bindValue(":nome", $_POST['nome'], PDO::PARAM_STR);
	$stm->bindValue(":cognome", $_POST['cognome'], PDO::PARAM_STR);
	$stm->bindValue(":classe", $_POST['classe'], PDO::PARAM_STR);
	$stm->bindValue(":numero", $_POST['numero'], PDO::PARAM_INT);
	$stm->bindValue(":taglia", $_POST['taglia'], PDO::PARAM_STR);
	$stm->bindValue(":ruolo", $_POST['ruolo'], PDO::PARAM_STR);
	$stm->bindValue(":luogo_nascita", $_POST['luogo_nascita'], PDO::PARAM_STR);
	$stm->bindValue(":data_nascita", $_POST['data_nascita'], PDO::PARAM_STR);
	try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql : $errmsg");
	}
	$lastId = $dbConnection->lastInsertId();

	return array("status" => true, "msg" => "Giocatore inserito", "idgiocatore" => $lastId);
}

function controllaTaglia($t){
	$t = strtoupper($t);
	$taglie = array("","XS", "S", "M", "L", "XL");
	for($i = 0; $i < count($taglie); $i++){
		if($t == $taglie[$i]){
			return true;
		}
	}
	return false;
}

function controllaRuolo($r){
	$r = strtoupper($r);
	$taglie = array("","ATT", "CEN", "DIF", "POR");
	for($i = 0; $i < count($taglie); $i++){
		if($r == $taglie[$i]){
			return true;
		}
	}
	return false;
}

function ControlloData($data){
	if(!preg_match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$^", $data)){
		return false;
	}else{
		$arrayData = explode("-", $data);
		$Giorno = $arrayData[2];
		$Mese = $arrayData[1];
		$Anno = $arrayData[0];
		if(!checkdate($Mese, $Giorno, $Anno)){
			return false;
		}
		$date1 = date_timestamp_get(new DateTime($data));
		$date2 = date_timestamp_get(new DateTime("now"));
		
		/* meno di 10 anni (calcolati in sec) */
		if($date2 - $date1 < 315360000){  
			return false;
		}
		return true;
	}
}

function controlloCodiceFiscale($cf){
	if($cf=='')
   return false;

	if(strlen($cf)!= 16)
   return false;

	$cf=strtoupper($cf);
	if(!preg_match("/[A-Z0-9]+$/", $cf))
   return false;
	$s = 0;
	for($i=1; $i<=13; $i+=2){
   $c=$cf[$i];
   if('0'<=$c and $c<='9')
		$s+=ord($c)-ord('0');
   else
		$s+=ord($c)-ord('A');
	}

	for($i=0; $i<=14; $i+=2){
   $c=$cf[$i];
   switch($c){
			case '0':  $s += 1;  break;
		case '1':  $s += 0;  break;
			case '2':  $s += 5;  break;
		case '3':  $s += 7;  break;
		case '4':  $s += 9;  break;
		case '5':  $s += 13;  break;
		case '6':  $s += 15;  break;
		case '7':  $s += 17;  break;
		case '8':  $s += 19;  break;
		case '9':  $s += 21;  break;
		case 'A':  $s += 1;  break;
		case 'B':  $s += 0;  break;
		case 'C':  $s += 5;  break;
		case 'D':  $s += 7;  break;
		case 'E':  $s += 9;  break;
		case 'F':  $s += 13;  break;
		case 'G':  $s += 15;  break;
		case 'H':  $s += 17;  break;
		case 'I':  $s += 19;  break;
		case 'J':  $s += 21;  break;
		case 'K':  $s += 2;  break;
		case 'L':  $s += 4;  break;
		case 'M':  $s += 18;  break;
		case 'N':  $s += 20;  break;
		case 'O':  $s += 11;  break;
		case 'P':  $s += 3;  break;
			case 'Q':  $s += 6;  break;
		case 'R':  $s += 8;  break;
		case 'S':  $s += 12;  break;
		case 'T':  $s += 14;  break;
		case 'U':  $s += 16;  break;
		case 'V':  $s += 10;  break;
		case 'W':  $s += 22;  break;
		case 'X':  $s += 25;  break;
		case 'Y':  $s += 24;  break;
		case 'Z':  $s += 23;  break;
   }
   }

   if( chr($s%26+ord('A'))!=$cf[15] )
   return false;

   return true;
}

?>