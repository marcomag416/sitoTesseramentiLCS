<?php
    function updatePsw($session, $dbConnection){
        if(!isset($_POST['pswOld']) || !isset($_POST['psw'])){
            return array("status" => false, "msg" => /*"Password non trovata"*/$_POST['pswOld']."  ".$_POST['psw']);
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
?>