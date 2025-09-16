<?php
// Filepath: backend/api/circulation/issue.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/BookIssue.php';

$database = new Database();
$db = $database->connect();

$book_issue = new BookIssue($db);

$data = json_decode(file_get_contents("php://input"));

// Check for required data
if (!empty($data->Book_id) && !empty($data->Student_id) && !empty($data->Librarian_user_id)) {
    $book_issue->Book_id = $data->Book_id;
    $book_issue->Student_id = $data->Student_id;
    $book_issue->Librarian_user_id = $data->Librarian_user_id; 

    if ($book_issue->issue()) {
        echo json_encode(['message' => 'Book Issued Successfully']);
    } else {
        echo json_encode(['message' => 'Failed to Issue Book. It may be unavailable or an error occurred.']);
    }
} else {
    echo json_encode(['message' => 'Incomplete data. Please provide Book_id, Student_id, and Librarian_user_id.']);
}
?>

