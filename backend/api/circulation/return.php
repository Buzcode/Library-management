<?php
// Filepath: backend/api/circulation/return.php

// --- START: CORRECTED CODE ---

// Set headers for CORS and content type
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS'); // We are using POST for this action
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle the browser's preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include necessary files
include_once '../../config/Database.php';
// We use the Loan model because it contains the correct return logic
include_once '../../models/Loan.php'; 

// Instantiate database and connect
$database = new Database();
$db = $database->connect();

// Instantiate Loan object
$loan = new Loan($db);

// Get the data sent from the frontend (e.g., from ActiveLoans.jsx)
$data = json_decode(file_get_contents("php://input"));

// We now expect 'issue_id' which is the unique ID for a specific loan
if (!empty($data->issue_id)) {
    
    // Call the new, safer function in the Loan model that uses a transaction
    if ($loan->returnBookByIssueId($data->issue_id)) {
        // If the return was successful
        http_response_code(200);
        echo json_encode(['message' => 'Book Returned Successfully']);
    } else {
        // If the return failed (e.g., already returned or invalid ID)
        http_response_code(409); // 409 Conflict is a good status code for this
        echo json_encode(['message' => 'Failed to Return Book. No open loan may exist for this item.']);
    }
} else {
    // If 'issue_id' was not provided in the request
    http_response_code(400); // 400 Bad Request
    echo json_encode(['message' => 'Incomplete data. Please provide the loan\'s issue_id.']);
}

// --- END: CORRECTED CODE ---
?>