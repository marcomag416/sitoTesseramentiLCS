<?php
function includeSql($filepath){
    $file = fopen($filepath, "r");
    $sql = fread($file, filesize($filepath));
    fclose($file);
    return $sql;
}

?>