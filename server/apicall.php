<?php

include('./config.php');

// get the q parameter from URL  
$q = $_GET['q'];

switch ($q) {
    case "a":
        $zc = $_GET['zc'];
        $abbr = $_GET['abbr'];
        $service_url = 'https://api.openweathermap.org/geo/1.0/zip?zip=' . $zc . ',' . $abbr . '&appid=' . $API_KEY;
        break;
    case "b":
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $service_url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' . $lat . '&lon=' . $lon . '&limit=1&appid=' . $API_KEY;
        break;
    case "c":
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
        $service_url = 'http://api.openweathermap.org/geo/1.0/reverse?lat=' . $lat . '&lon=' . $lon . '&limit=1&appid=' . $API_KEY;
        break;
    default:
        echo '{"error": "The request for weather failed"}';
        die('error occured!');
}

$curl = curl_init($service_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$curl_response = curl_exec($curl);
if ($curl_response === false) {
    $info = curl_getinfo($curl);
    curl_close($curl);
    die('error occured during curl exec. Additioanl info: ' . var_export($info));
}
curl_close($curl);
$decoded = json_decode($curl_response);
if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
    die('error occured: ' . $decoded->response->errormessage);
}
echo $curl_response;
