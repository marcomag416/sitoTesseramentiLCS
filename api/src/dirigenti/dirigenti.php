<?php
require_once ROOTPATH.'/src/tesserati/tesserati.php';

function contaDirigenti($session, $dbConnection){
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/contDirigenti.sql");
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
	if($session['elInviato']){
		return array("status" => false, "msg" => "impossibile modificare un elenco tesserati inviato");
	}
	if(!isset($_POST['iddirigente'])){
		return array("status" => false, "msg" => "id dirigente non trovato");
	}
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/moveDirigenteToBin.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":iddirigente", $_POST['iddirigente'], PDO::PARAM_STR);
	$stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_STR);
	$stm->execute();
	return array("status" => true, "msg" => "Dirigente spostato nel cestino");
}

function leggiDirigenti($token, $dbConnection){
	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/selectDirigenti.sql");
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
	if($session['elInviato']){
		return array("status" => false, "msg" => "impossibile modificare un elenco tesserati inviato");
	}
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


	$sql = file_get_contents(ROOTPATH."/src/sqlQueries/insertDirigente.sql");
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

?>