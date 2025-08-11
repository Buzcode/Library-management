<?php
// Filepath: backend/api/catalogue/delete.php (Updated Content)

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-control-allow-methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();

$item = new Catalogue($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->Book_id)) {
    $item->Book_id = $data->Book_id;

    // Call the new archive() method
    if ($item->archive()) {
        // We can keep the message the same for the frontend
        echo json_encode(['message' => 'Catalogue Item Deleted']);
    } else {
        echo json_encode(['message' => 'Catalogue Item Not Deleted']);
    }
} else {
    echo json_encode(['message' => 'No Book_id provided.']);
}
?>