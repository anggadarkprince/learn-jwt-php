<?php

require_once __DIR__ . '/../vendor/autoload.php';
include('../config/core.php');

use App\User;
use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: http://localhost/jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate user object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// set product property values
$user->email = $data->email;
$email_exists = $user->emailExists();

// check if email exists and if password is correct
if ($email_exists && password_verify($data->password, $user->password)) {
    $token = [
        "issuer" => $issuer,
        "audience" => $audience,
        "issuedAt" => $issuedAt,
        "expirationTime" => $expirationTime,
        "data" => [
            "id" => $user->id,
            "name" => $user->name,
            "username" => $user->username,
            "email" => $user->email
        ]
    ];

    // set response code
    http_response_code(200);

    // generate jwt
    $jwt = JWT::encode($token, $key);
    echo json_encode([
        "message" => "Successful login.",
        "jwt" => $jwt
    ]);

} else {
    // set response code
    http_response_code(401);

    // tell the user login failed
    echo json_encode(["message" => "Login failed."]);
}