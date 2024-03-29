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
        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/updatePsw.sql");
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
        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/inviaElencoTesserati.sql");
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
        $token = str_replace("\\", ".", $token);
        $token = str_replace("/", ".", $token);

        $d=strtotime("+$delay Days");

        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/insertCodiceRipristino.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idamm", $idamm, PDO::PARAM_STR);
        $stm->bindValue(":token", $token, PDO::PARAM_STR);
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

        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/selectIdammCodiceRipristino.sql");
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
        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/updatePsw.sql");
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

    function recoverPsw($dbConnection){
        if(!isset($_POST['mail']) || $_POST['mail'] == ""){
            return array("status" => false, "msg" => "mail di recupero non trovata");
        }
        return inviaMailRipristino($_POST['mail'], $dbConnection);
    }

    function inviaMailRipristino($mail, $dbConnection){
        $sql = "SELECT distinct id as idamm FROM `amministratori` WHERE mail = :mail;";
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":mail", $mail, PDO::PARAM_STR);
        $stm->execute();
        $amm = $stm->fetch(PDO::FETCH_ASSOC);

        if($stm -> rowCount() != 1){
            return array("status" => false, "msg" => "Mail non registrata");
        }

        $codice = creaCodiceRipristino($amm['idamm'], 1, $dbConnection);

        $link = "https://tesseramenti.molecup.com/psw-reset/$codice";

        $to = $mail;
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=iso-8859-1';
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        $headers[] = 'From: LCS staff <noreply@legacalciostudenti.com>';
        $headers[] = 'Reply-To: <gastoneemprin03@gmail.com>';
        $subject = "Ripristino password";
        $message = file_get_contents(ROOTPATH."/src/mailMessages/recuperoPassword.html");
        $message = str_replace(":link", $link, $message);
        $message = wordwrap($message, 70, "\r\n");
        if(!mail($to, $subject, $message, implode("\r\n", $headers))){
            return array("status" => false, "msg" => "Errore invio mail");
        }
        else{
            return array("status" => true, "msg" => "Mail inviata con successo");
        }
    }

    function cambiaSquadra($session, $dbConnection){
        if($session['super'] != 1 || !isset($_POST['idsquadra']) || $_POST['idsquadra'] == null){
            return array("status" => false, "msg" => "Bad request - richiesta non valida");
        }

        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/updateIdSquadre.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idamm", $session['id'], PDO::PARAM_INT);
        $stm->bindValue(":idsquadra", $_POST['idsquadra'], PDO::PARAM_INT);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore generico");
        }
        return array("status" => true, "msg" => "Squadra cambiata correttamente");
    }

    function elencoSquadre($session, $dbConnection){
        if($session['super'] != 1){
            return array("status" => false, "msg" => "Acesso non autorizzato");
        }

        $sql = file_get_contents(ROOTPATH."/src/sqlQueries/selectSquadre.sql");
        $stm = $dbConnection -> prepare($sql);
        $stm->bindValue(":idlega", $session['idlega'], PDO::PARAM_INT);
        try{
            $stm->execute();
        }catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return array("status" => false, "msg" => "Errore generico");
        }

        $cont = 0;
        while( $row = $stm->fetch(PDO::FETCH_ASSOC)){
            $result[$cont++] = $row;
        }
        return array("status" => true, "vett" => $result);
    }
?>