<?php

function sessionCheck($token, $dbConnection){
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\selectSessionInfo.sql");
	$stm = $dbConnection -> prepare($sql);
	//$stm->bindValue(":scadenzaSess", 2000000);
	$stm->bindValue(":token", $token);
	$stm->execute();

	if($stm->rowCount() == 1){
		$utente = $stm->fetch(PDO::FETCH_ASSOC);
		$return['mail'] = $utente['mail'];
		$return['id'] = $utente['id'];
		$return['squadra'] = $utente['squadra'];
		$return['idsquadra'] = $utente['idsquadra'];
		$return['stagione'] = $utente['stagione'];
		$return['idstagione'] = $utente['idstagione'];
	    $return['lega'] = $utente['lega'];
		$return['status'] = true;

		$return['elInviato'] = controlloInvioElenco($utente['idsquadra'], $utente['idstagione'], $dbConnection);
	}
	else{
		$return['status'] = false;
	}
	return $return;
}

function leggiToken(){
	$rest_json = file_get_contents("php://input");
	$input = json_decode($rest_json, true);

	if (empty($input['token'])){
		if(isset($_POST['token'])){
			return $_POST['token'];
		}
		else{
			return false;
		}
	}
	return $input['token'];
}

function deleteSession($token, $dbConnection){
	$sql = "delete FROM `sessioni` WHERE `sessioni`.`token` = ?;";
	$stm = $dbConnection -> prepare($sql);
	$stm -> bindValue(1, $token);
	$stm ->execute();
}

function controlloInvioElenco($idsquadra, $idstagione, $dbConnection){
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\controlloElencoInviato.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idsquadra", $idsquadra);
	$stm->bindValue(":idstagione", $idstagione);
	$stm->execute();

	if($stm->rowCount() == 1){
		$ele = $stm->fetch(PDO::FETCH_ASSOC);
		return $ele['elencoInviato'];
	}
	return 0;
}

?>