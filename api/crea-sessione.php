<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$rest_json = file_get_contents("php://input");
$input = json_decode($rest_json, true);

echo json_encode(array("msg" => $input['token'], "loginOk" => true));
//echo("apifunzionante");
?>