<?php
function leggiTesserati($token, $dbConnection){
	$sql = "Select gio.cf as cf, gio.nome, gio.cognome, gio.classe, gio.data_nascita, gio.luogo_nascita, gio.ruolo, gio.taglia, gio.numero_maglia, cert.scadenza, cert.fisico FROM `giocatori` as gio, g_tesserati as gtess, certificati_med as cert, squadre as sq, stagioni as stag, amministratori as amm, sessioni as sess WHERE sq.id = gio.id_squadra and gio.id = gtess.id_giocatore and stag.id = gtess.id_stagione and cert.id_giocatore = gio.id and stag.id = amm.id_stagione and sq.id = amm.id_squadra and amm.id = sess.id_amministratore and sess.token = ? order by gio.id";
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(1, $token);
	$stm->execute();

	if($stm -> rowCount() == 0){
		return array("status" => false, "msg" => "Nessun giocatore trovato");
	}
	$cont = 0;
	while( $row = $stm->fetch(PDO::FETCH_ASSOC)){
		//$row['certificato'] = controllaScadenza($row['scadenza'], $row['fisico']);
		$date = new DateTime($row['scadenza']);
		$row['scadenza'] = date_timestamp_get($date);
		$result[$cont++] = $row;
	}
	return array("status" => true, "vett" => $result);
	
}

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

?>