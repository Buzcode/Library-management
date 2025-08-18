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
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    }
    exit(0);
}
// --- END OF DEFINITIVE CORS & PREFLIGHT HANDLING ---

// Set the content type for the actual response
header('Content-Type: application/json');

// --- DATABASE AND MODEL INCLUDES ---
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/User.php';

// --- APPLICATION LOGIC ---
$database = new Database();
// Note: Use connect() or getConnection() depending on your database.php file.
// Based on your previous file, it should be connect().
$db = $database->connect();

if ($db === null) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection error.']);
    exit();
}

$user = new User($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"));

// --- VALIDATION ---
// Check if all required fields are present in the JSON
if (
    !empty($data->FirstName) &&
    !empty($data->LastName) &&
    !empty($data->Email) &&
    !empty($data->Password) &&
    !empty($data->UserType)
) {
    // --- ASSIGN DATA TO USER OBJECT ---
    // Combine FirstName and LastName into the single Name property the model expects
    $user->Name = $data->FirstName . ' ' . $data->LastName;
    $user->Email = $data->Email;
    $user->Password = $data->Password; // The create() method in the User model should handle hashing
    $user->UserType = $data->UserType;
    $user->Status = 'Pending'; // Business Rule: All new registrations require approval.

    // --- ATTEMPT TO CREATE USER ---
    if ($user->create()) {
        // Success
        http_response_code(201); // 201 Created
        echo json_encode(['message' => 'User created successfully. Awaiting admin approval.']);
    } else {
        // Failure (e.g., duplicate email, database error)
        http_response_code(503); // 503 Service Unavailable
        echo json_encode(['message' => 'Unable to create user.']);
    }
} else {
    // Incomplete data sent from client
    http_response_code(400); // 400 Bad Request
    echo json_encode(['message' => 'Incomplete data. Please provide FirstName, LastName, Email, Password, and UserType.']);
}
?>