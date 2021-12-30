<?php

function caricaFileCertificato($session, $user){
    /* controllo preliminari sui dati caricati */
    if (!isset($_FILES['fileCertificato']) || !is_uploaded_file($_FILES['fileCertificato']['tmp_name'])) {
        return array("status" => false, "msg" => "Nessun file caricato");
    }

    if(!isset($_POST['scadenza']) || $_POST['scadenza'] == ""){
		return array("status" => false, "msg" => "Scadenza certificato mancante");
	}

    if ($_FILES['fileCertificato']['size'] > MAX_FILE_SIZE) {
        return array("status" => false, "msg" => "File di dimensione troppo grande");
    }

    $ext_ok = array('pdf', 'jpeg', 'jpg', 'png');
    $temp = explode('.', $_FILES['fileCertificato']['name']);
    $ext = end($temp);
    if (!in_array($ext, $ext_ok)) {
        return array("status" => false, "msg" => "Estensione file non ammessa");
    }

    /*$is_img = getimagesize($_FILES['fileCertificato']['tmp_name']);
    if (!$is_img) {
        return array("status" => false, "msg" => "File non valido");    
    }*/

    $allowed_types = array ( 'application/pdf', 'image/jpeg', 'image/jpg', 'image/png' );
    $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
    $detected_type = finfo_file( $fileInfo, $_FILES['fileCertificato']['tmp_name'] );
    if ( !in_array($detected_type, $allowed_types) ) {
        return array("status" => false, "msg" => "Il file deve essere un'immagine o pdf");
    }
    
    //percorso della cartella dove mettere i file caricati dagli utenti
    $uploaddir = ROOTPATH.'\uploads\certificati\\';
    
    //Recupero il percorso temporaneo del file
    $userfile_tmp = $_FILES['fileCertificato']['tmp_name'];
    
    //calcolo il nome del nuovo file
    $userfile_name = $session['stagione'] . "_" . $session['squadra'] . "_" . $user['cognome'] . "_" . $user['nome'] . "_" . $user['cf'] . "_" . $_POST['scadenza'];
    $cont = 1;
    while(file_exists($uploaddir . $userfile_name . "_" . $cont . "." .$ext)){
        $cont ++;
    }
    $userfile_name .= "_" . $cont . "." . $ext;
    
    //copio il file dalla sua posizione temporanea alla mia cartella upload
    if (move_uploaded_file($userfile_tmp, $uploaddir . $userfile_name)) {
        //Se l'operazione è andata a buon fine...
        return array("status" => true, "msg" => "File certificato caricato", "filename" => $uploaddir . $userfile_name);
    }else{
        //Se l'operazione è fallta...
        return array("status" => false, "msg" => "Errore caricamento file certificato");
    }
}

function uploadCertificatoDati($session, $dbConnection){
    /* Controllo preliminare dati caricati */
    if(!isset($_POST['cf']) || !isset($_POST['nome']) ||!isset($_POST['cognome']) || !isset($_POST['data_nascita'])){
		return array("status" => false, "msg" => "Dati Giocatore mancanti");
	}
    if($_POST['cf'] == "" || $_POST['nome'] == "" || $_POST['cognome'] == "" || $_POST['data_nascita'] == ""){
        return array("status" => false, "msg" => "Dati Giocatore mancanti");
    }

    /* Manipolazione dati giocatore */
    $_POST['nome'] = ucwords(strtolower($_POST['nome']));
	$_POST['cognome'] = ucwords(strtolower($_POST['cognome']));
    $_POST['cf'] = strtoupper($_POST['cf']);

    $user = array("cf" => $_POST['cf'], "nome" => $_POST['nome'], "cognome" => $_POST['cognome'], "data_nascita" => $_POST['data_nascita']);

    /* Carico file certificato */
    $fileStatus = caricaFileCertificato($session, $user);

    if(!$fileStatus['status']){
        return $fileStatus;
    }

    /* Inserisco certificato nel database */
    $sql = file_get_contents(ROOTPATH."/src/sqlQueries/insertCertificatoFromData.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":cf", $user['cf'], PDO::PARAM_STR);
    $stm->bindValue(":nome", $user['nome'], PDO::PARAM_STR);
	$stm->bindValue(":cognome", $user['cognome'], PDO::PARAM_STR);
	$stm->bindValue(":data_nascita", $user['data_nascita'], PDO::PARAM_STR);
    $stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
	$stm->bindValue(":nomefile", $fileStatus['filename'], PDO::PARAM_STR);
	$stm->bindValue(":scadenza", $_POST['scadenza'], PDO::PARAM_STR);
    try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql : $errmsg");
	}

    return array("status" => true, "msg" => "Certificato medico aggiunto");
}

function uploadCertificatoID($session, $dbConnection){
    /* Controllo preliminare dati caricati */
    if(!isset($_POST['idgiocatore']) || $_POST['idgiocatore'] == ""){
        return array("status" => false, "msg" => "Id giocatore mancante");
    }

    /* Recupero informazioni giocatore  
    $sql = file_get_contents(ROOTPATH."\src\sqlQueries\selectGiocatoreById.sql");
	$stm = $dbConnection -> prepare($sql);
	$stm->bindValue(":idgiocatore", $_POST['idgiocatore'], PDO::PARAM_INT);
    $stm->bindValue(":idsquadra", $session['idsquadra'], PDO::PARAM_INT);
    $stm->bindValue(":idstagione", $session['idstagione'], PDO::PARAM_INT);
    try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql : $errmsg");
	}

    if($stm->rowCount() != 1){
        return array("status" => false, "msg" => "Autorizzazione negata");
    }

    $tmp = $stm->fetch(PDO::FETCH_ASSOC);
    $user['cf'] = $tmp['cf'];
    $user['nome'] = $tmp['nome'];
    $user['cognome'] = $tmp['cognome'];
    $user['data_nascita'] = $tmp['data_nascita'];

    /* Carico file certificato 
    $fileStatus = caricaFileCertificato($session, $user);

    if(!$fileStatus['status']){
        return $fileStatus;
    }*/

    /* Inserisco certificato nel database */
    $sql = file_get_contents(ROOTPATH."/src/sqlQueries/insertCertificatoFromId.sql");
	$stm = $dbConnection -> prepare($sql);
    $stm->bindValue(":idgiocatore", $_POST['idgiocatore'], PDO::PARAM_INT);
	$stm->bindValue(":nomefile", /*$fileStatus['filename']*/"", PDO::PARAM_STR);
	$stm->bindValue(":scadenza", $_POST['scadenza'], PDO::PARAM_STR);
    try{
		$stm->execute();
	}catch (\PDOException $e) {
		$errmsg = $e->getMessage();
		return array("status" => false, "msg" => "Errore sql 2 : $errmsg");
	}

    return array("status" => true, "msg" => "Certificato medico aggiunto");
}

?>