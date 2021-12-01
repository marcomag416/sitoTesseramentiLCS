<?php
function leggiTesserati($token, $dbConnection){
	$sql = file_get_contents(ROOTPATH."\src\sqlQueries\selectGiocatori.sql");
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