<?php
// Filepath: backend/api/catalogue/update.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT'); // PUT is standard for updates
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();

$item = new Catalogue($db);

$data = json_decode(file_get_contents("php://input"));

// Make sure ID is provided
if (!empty($data->Book_id)) {
    // Set ID of item to be updated
    $item->Book_id = $data->Book_id;

    // Set other properties from the received data
    $item->Total_copies = $data->Total_copies;
    $item->Available_copies = $data->Available_copies;
    $item->Author = $data->Author;
    $item->Publication = $data->Publication;
    $item->URL = $data->URL ?? '';
    $item->Book_Type = $data->Book_Type;
    $item->File_Format = $data->File_Format ?? '';


    if ($item->update()) {
        echo json_encode(['message' => 'Catalogue Item Updated']);
    } else {
        echo json_encode(['message' => 'Catalogue Item Not Updated']);
    }
} else {
    echo json_encode(['message' => 'No Book_id provided.']);
}
?>