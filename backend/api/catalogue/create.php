<?php
// Filepath: backend/api/catalogue/create.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();

$item = new Catalogue($db);

$data = json_decode(file_get_contents("php://input"));

// Make sure required data is present
if (
    !empty($data->Author) &&
    !empty($data->Publication) &&
    isset($data->Total_copies) &&
    isset($data->Available_copies) &&
    !empty($data->Book_Type)
) {
    // Set catalogue item properties
    $item->Total_copies = $data->Total_copies;
    $item->Available_copies = $data->Available_copies;
    $item->Author = $data->Author;
    $item->Publication = $data->Publication;
    $item->URL = $data->URL ?? ''; // Use null coalescing for optional fields
    $item->Book_Type = $data->Book_Type;
    $item->File_Format = $data->File_Format ?? '';

    if ($item->create()) {
        echo json_encode(['message' => 'Catalogue Item Created']);
    } else {
        echo json_encode(['message' => 'Catalogue Item Not Created']);
    }
} else {
    echo json_encode(['message' => 'Incomplete data provided.']);
}
?>