<?php
function apiCurl($url=null, $auth){
    $curl = curl_init();
    $url = 'https://rockchoir.magentrix.com/rest/2.0/'.$url;

    curl_setopt_array($curl, array(
        //CURLOPT_URL => "http://rockchoir.magentrix.com/rest/2.0/query?q=FROM%20Force.Force__Account%20WHERE%20!string.IsNullOrEmpty(Name)",
        //CURLOPT_URL => "http://rockchoir.magentrix.com/rest/2.0/query?q=FROM%20Force.Force__Choir_Session__c",
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "authorization: ".$auth,
            "cache-control: no-cache",
            "postman-token: 796a6376-221b-24f7-7584-a0e353dee9a7"
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
}

$url = $_GET['url'];
$token = $_GET['token'];
//echo $url;

apiCurl($url, $token);