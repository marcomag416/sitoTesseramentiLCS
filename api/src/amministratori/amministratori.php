<?php
    function updatePsw($session, $dbConnection){
        if(!isset($_POST['pswOld']) || !isset($_POST['psw'])){
            return array("status" => false, "msg" => "Password non trovata");
        }
        if(!controlloPsw($_POST['psw'])){
            return array("status" => false, "msg" => "Password non valida");
        }
        $stm = $dbConnection -> prepare("SELECT psw FROM `amministratori` WHERE id = :idamm");
        $stm->bindParam(":idamm", $session['id']);
        $stm->execute();

        if($stm->rowCount() != 1){
            return array("status" => false, "msg" => "Utente non trovato");
        }
        $utente = $stm->fetch(PDO::FETCH_ASSOC);
        if(!password_verify($_POST['pswOld'], $utente['psw'])){
            return array("status" => false, "msg" => "Password errata");
        }

        $psw =  password_hash($_POST['psw'], PASSWORD_DEFAULT);
        $sql = file_get_contents(ROOTPATH."\src\sqlQueries\updatePsw.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idamm", $session['id'], PDO::PARAM_STR);
        $stm->bindValue(":psw", $psw, PDO::PARAM_STR);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore sql : $errmsg");
        }
        return array("status" => true, "msg" => "Password aggiornata");

    }

    function inviaElenco($session, $dbConnection){
        $sql = file_get_contents(ROOTPATH."\src\sqlQueries\inviaElencoTesserati.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindParam(":idsquadra", $session['idsquadra']);
        $stm->bindParam(":idstagione", $session['idstagione']);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore sql : $errmsg");
        }
    
        return array("status" => true, "msg" => "Elenco inviato");
    }

    function creaCodiceRipristino($idamm, $delay,  $dbConnection){
        $raw_token = $idamm.strval(time()).random_bytes(32);
        $token = password_hash($raw_token, PASSWORD_DEFAULT);

        $d=strtotime("+$delay Days");

        $sql = file_get_contents(ROOTPATH."\src\sqlQueries\insertCodiceRipristino.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idamm", $idamm, PDO::PARAM_STR);
        $stm->bindValue(":psw", $token, PDO::PARAM_STR);
        $stm->bindValue(":scadenza", date("Y-m-d h:i:s", $d), PDO::PARAM_STR);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return "error";
        }
        return $token;
    }

    function resetPsw($dbConnection){
        if(!isset($_POST['token']) || !isset($_POST['psw']) || $_POST['token'] == "" ){
            return array("status" => false, "msg" => "Parametri mancanti");
        }

        if(!controlloPsw($_POST['psw'])){
            return array("status" => false, "msg" => "Password non valida");
        }

        $sql = file_get_contents(ROOTPATH."\src\sqlQueries\selectIdammCodiceRipristino.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":token", $_POST['token'], PDO::PARAM_STR);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore generico");
        }

        if($stm->rowCount() != 1){
            return array("status" => false, "msg" => "Link non valido");
        }
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        
        $psw =  password_hash($_POST['psw'], PASSWORD_DEFAULT);
        $sql = file_get_contents(ROOTPATH."\src\sqlQueries\updatePsw.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idamm", $row['idamm'], PDO::PARAM_STR);
        $stm->bindValue(":psw", $psw, PDO::PARAM_STR);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore sql : $errmsg");
        }

        $sql = "delete from codici_ripristino where token = :token;";
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":token", $_POST['token'], PDO::PARAM_STR);
        $stm->execute();

        return array("status" => true, "msg" => "Password aggiornata");
    }

    function controlloPsw($psw){
        if(strlen($psw) < 8){
            return false;
        }
        return true;
    }
?>