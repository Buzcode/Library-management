<?php
// Filepath: backend/api/circulation/return.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT'); // Using PUT or POST is common for this action
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/BookIssue.php';

$database = new Database();
$db = $database->connect();

$book_issue = new BookIssue($db);

$data = json_decode(file_get_contents("php://input"));

// Check that Book_id is provided
if (!empty($data->Book_id)) {
    $book_issue->Book_id = $data->Book_id;

    if ($book_issue->returnBook()) {
        echo json_encode(['message' => 'Book Returned Successfully']);
    } else {
        echo json_encode(['message' => 'Failed to Return Book. No open loan may exist for this item.']);
    }
} else {
    echo json_encode(['message' => 'Incomplete data. Please provide Book_id.']);
}
?>