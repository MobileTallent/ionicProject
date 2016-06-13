<?php
$choirsession = $_GET['choirsession'];
$qrdata = $_GET['qrdata'];
$token = $_GET['token'];

$ret = post($qrdata,$sessionID,$token);

echo $ret;

function post($cc_no, $session_id, $authToken)
{
$curl = curl_init();
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_URL, "https://rockchoir.magentrix.com/rest/2.0/create?e=Force__Card_Scan__c");
curl_setopt($curl, CURLOPT_HTTPHEADER,array("Authorization: " . $authToken));
curl_setopt($ch,CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS,array("data" => "{\"Card_Number__c\":\"$cc_no\", \"Choir_Session__c\":\"$session_id\"}"));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);
return $result;
}