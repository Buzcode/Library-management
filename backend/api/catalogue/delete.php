<?php
// Filepath: backend/api/catalogue/delete.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/Database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();
$item = new Catalogue($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->Book_id)) {
    $item->Book_id = $data->Book_id;

    if ($item->archive()) {
        http_response_code(200);
        echo json_encode(['message' => 'Catalogue Item Deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Catalogue Item Not Deleted']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'No Book_id provided.']);
}
?>