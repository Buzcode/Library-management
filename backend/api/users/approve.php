<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT'); // PUT method for updates
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->connect();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// Make sure ID is provided
if (!empty($data->Student_id)) {
    $user->Student_id = $data->Student_id;

    if ($user->approve()) {
        echo json_encode(['message' => 'User Approved']);
    } else {
        echo json_encode(['message' => 'User Not Approved']);
    }
} else {
    echo json_encode(['message' => 'No Student_id provided.']);
}
?>