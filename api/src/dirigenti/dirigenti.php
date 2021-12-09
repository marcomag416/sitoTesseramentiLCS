<?php
function contaDirigenti($session, $dbConnection){
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\contDirigenti.sql");
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

function deleteDirigente($session, $dbConnection){
	if(!isset($_POST['iddirigente'])){
		return array("status" => false, "msg" => "id dirigente non trovato");
	}
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\moveDirigenteToBin.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":iddirigente", $_POST['iddirigente'], PDO::PARAM_STR);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_STR);
	$stm->execute();
	return array("status" => true, "msg" => "Dirigente spostato nel cestino");
}

function leggiDirigenti($token, $dbConnection){
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\selectDirigenti.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":token", $token, PDO::PARAM_STR);
	$stm->execute();

	if($stm -> rowCount() == 0){
		return array("status" => false, "msg" => "Nessun dirigente trovato");
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

function uploadDirigente($session, $dbConnection){
	/* controllo campi */
	if(!isset($_POST['cf']) || !isset($_POST['nome']) ||!isset($_POST['cognome']) ){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	if($_POST['cf'] == "" || $_POST['nome'] == "" || $_POST['cognome'] == "" ){
		return array("status" => false, "msg" => "Campi obbligatori mancanti");
	}

	$_POST['cf'] = strtoupper($_POST['cf']);
	if(!controlloCodiceFiscale($_POST['cf'])){
		return array("status" => false, "msg" => "Codice fiscale non valido");
	}
	
	$_POST['nome'] = ucwords(strtolower($_POST['nome']));
	$_POST['cognome'] = ucwords(strtolower($_POST['cognome']));


	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\insertGiocatori.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
	$stm->bindValue(":idstagione", $session['idstagione'], PDO::PARAM_INT);
	$stm->bindValue(":cf", $_POST['cf'], PDO::PARAM_STR);
	$stm->bindValue(":nome", $_POST['nome'], PDO::PARAM_STR);
	$stm->bindValue(":cognome", $_POST['cognome'], PDO::PARAM_STR);
	try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql : $errmsg");
	}
	$lastId = $dbConnection->lastInsertId();

	return array("status" => true, "msg" => "Dirigente inserito", "iddirigente" => $lastId);
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