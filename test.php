<?php

$ret = post("1","a031a000002zFckAAE","64A946E9A9CE914684E96B0B37A6AA9609FCF612A228EEC4A46FE253638984FE96FCF223EC4E3D64A980AF13E1EE35B365576789955B55E9FB5EE57980D12CBB0F8331C24E1BDBA683914394FA550197262515395AB3873B76D1873915B4AA85823C1A05B3C4C9FC93FEAB6D3F251D65BECF0E5EF008B659EF1BB719CF6A6B137F153B50C9B52A654D2574775F1E2760");

print_r($ret);

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