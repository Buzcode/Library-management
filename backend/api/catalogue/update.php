<?php
// Filepath: backend/api/catalogue/update.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, OPTIONS'); // Add OPTIONS for pre-flight requests
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();
$item = new Catalogue($db);

$data = json_decode(file_get_contents("php://input"));

// Make sure ID is provided
if (!empty($data->Book_id)) {
    // --- FIX: Set ALL properties on the item object to be updated ---
    $item->Book_id = $data->Book_id;
    $item->Author = $data->Author ?? '';
    $item->Publication = $data->Publication ?? '';
    $item->Total_copies = $data->Total_copies ?? 0;
    $item->Available_copies = $data->Available_copies ?? 0;

    // Use the correct property names (Book_type, File_format)
    // The data from the frontend will also have these keys
    $item->Book_type = $data->Book_type ?? 'Physical';
    $item->URL = $data->URL ?? '';
    $item->File_format = $data->File_format ?? '';
    $item->Status = $data->Status ?? 'Active'; // Ensure status is preserved


    // Now, call the update function
    if ($item->update()) {
        http_response_code(200);
        echo json_encode(['message' => 'Book Updated Successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Book Not Updated']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'No Book_id provided.']);
}
?>