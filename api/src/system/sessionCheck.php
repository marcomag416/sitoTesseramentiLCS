<?php

function sessionCheck($token, $dbConnection){
	$stm = $dbConnection -> prepare("select amm.id, amm.mail, sq.nome as squadra, sq.id as idsquadra, stag.nome as stagione, stag.id as idstagione, leghe.nome as lega  from amministratori as amm, sessioni as sess, squadre as sq, stagioni as stag, leghe where amm.id_squadra = sq.id and amm.id_stagione = stag.id and sq.id_lega = leghe.id and stag.scadenza > CURRENT_DATE and sess.id_amministratore = amm.id and (sess.ultimo_accesso + ?) > CURRENT_TIMESTAMP and sess.token = ? order by amm.id");
	$stm->bindValue(1, 2000000);
	$stm->bindValue(2, $token);
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

?>