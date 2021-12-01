<?php
function leggiTesserati($token, $dbConnection){
	//$sql = readfile("C:\Users\marco\Documents\sitoTesseramentiMolecup\api\src\sqlQueries\selectGiocatori.sql") or die ("errore");
	//echo($sql);
	$sql = "select * from (Select gio.id, gio.cf as cf, gio.nome, gio.cognome, gio.classe, gio.data_nascita, gio.luogo_nascita, gio.ruolo, gio.taglia, gio.numero_maglia, max(cmed.scadenza)as scadenza FROM sessioni sess
	inner join amministratori amm on amm.id = sess.id_amministratore and sess.token = :token
	inner join squadre sq on amm.id_squadra = sq.id,
	g_tesserati gtess
	inner join giocatori gio on gtess.id_giocatore = gio.id
	left join certificati_med cmed on cmed.id_giocatore = gio.id,
	stagioni stag
	WHERE stag.id = gtess.id_stagione and stag.id = amm.id_stagione and stag.scadenza > CURRENT_DATE and gio.id_squadra = sq.id
	group by gio.id order by gio.id) tabA
	left join (select fisico, scadenza from certificati_med )cmed on cmed.scadenza = tabA.scadenza;";
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

?>