<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- START: BRUTE-FORCE CORS HANDLING ---
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// --- END: BRUTE-FORCE CORS HANDLING ---

header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/Database.php';
include_once '../../models/BookIssue.php';

// Instantiate database and connect
$database = new Database();
$db = null;

try {
    // --- THIS IS THE FIX ---
    // The variable '$database' now has the correct dollar sign.
    $db = $database->connect();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection error: " . $e->getMessage()));
    exit();
}

// Instantiate BookIssue object
$bookIssue = new BookIssue($db);

// Get the data sent from the frontend
$data = json_decode(file_get_contents("php://input"));

// --- START: ADDED DEBUGGING LOG ---
// This will write the received data to your server's error log.
// This helps confirm that the frontend is sending the correct IDs.
error_log("Received data for book issue: " . print_r($data, true));
// --- END: ADDED DEBUGGING LOG ---

// Validate the incoming data
if (empty($data->student_id) || empty($data->book_id)) {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Both student_id and book_id are required."));
    exit();
}

// Attempt to issue the book
if ($bookIssue->issueBookByStudent($data->student_id, $data->book_id)) {
    http_response_code(201);
    echo json_encode(array("message" => "Book issued successfully."));
} else {
    http_response_code(409);
    echo json_encode(array("message" => "Failed to issue book. It may be out of stock or another error occurred."));
}
?>