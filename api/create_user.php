<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\User;

header("Access-Control-Allow-Origin: http://localhost/jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate product object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// set product property values
$user->name = $data->name;
$user->username = $data->username;
$user->email = $data->email;
$user->password = $data->password;

// create the user
if (!empty($user->name) && !empty($user->username) && !empty($user->email) && !empty($user->password) && $user->create()) {
    // set response code
    http_response_code(200);

    // display message: user was created
    echo json_encode(array("message" => "User was created."));
} else {
    // set response code
    http_response_code(400);

    // display message: unable to create user
    echo json_encode(array("message" => "Unable to create user."));
}