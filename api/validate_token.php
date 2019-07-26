<?php

require_once __DIR__ . '/../vendor/autoload.php';
include('../config/core.php');

use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: http://localhost/jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get posted data
$data = json_decode(file_get_contents("php://input"));

$jwt = isset($data->jwt) ? $data->jwt : "";

// if jwt is not empty
if ($jwt) {
    // if decode succeed, show user details
    try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, ['HS256']);

        // set response code
        http_response_code(200);

        // show user details
        echo json_encode(array(
            "message" => "Access granted.",
            "data" => $decoded->data
        ));

    } catch (Exception $e) {
        // set response code
        http_response_code(401);

        // tell the user access denied  & show error message
        echo json_encode([
            "message" => "Access denied.",
            "error" => $e->getMessage()
        ]);
    }
} else {
    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(["message" => "Access denied."]);
}