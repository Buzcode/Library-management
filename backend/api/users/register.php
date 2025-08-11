<?php
// Filepath: backend/api/users/register.php

// --- START OF DEFINITIVE CORS & PREFLIGHT HANDLING ---
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        // Here, we explicitly allow the methods we use
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        // And we explicitly allow the headers our app sends
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    }
    // We are done with the preflight request, so we exit
    exit(0);
}
// --- END OF DEFINITIVE CORS & PREFLIGHT HANDLING ---


// Set the content type for the actual response
header('Content-Type: application/json');

// --- DATABASE AND MODEL INCLUDES ---
// The paths must be exactly correct relative to this file's location
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/User.php';

// --- APPLICATION LOGIC ---
$database = new Database();
$db = $database->connect();

// If the database connection fails, send an error and stop
if ($db === null) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection error.']);
    exit();
}

$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->Name) && !empty($data->Email) && !empty($data->Password)) {
    $user->Name = $data->Name;
    $user->Email = $data->Email;
    $user->Password = $data->Password;

    if ($user->create()) {
        echo json_encode(['message' => 'User Created Successfully']);
    } else {
        echo json_encode(['message' => 'User Not Created']);
    }
} else {
    echo json_encode(['message' => 'Incomplete data. Please provide Name, Email, and Password.']);
}
?>