<?php
// Filepath: backend/api/catalogue/create.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// --- START: CORRECTED LOGIC TO MATCH THE CATALOGUE MODEL ---

// Set properties on the $item object using the correct property names
$item->Book_Title = $_POST['Book_Title'] ?? '';
$item->Author = $_POST['Author'] ?? '';
$item->Publication = $_POST['Publication'] ?? '';
$item->Total_copies = $_POST['Total_copies'] ?? 1;
$item->Available_copies = $_POST['Total_copies'] ?? 1; // Available should match Total for a new book

// Use the CORRECT property names: 'Book_type' and 'File_format'
$item->Book_type = $_POST['Book_Type'] ?? 'Physical';
$item->File_format = ''; // Default to empty
$item->URL = '';         // Default to empty

// Handle the PDF file upload if the book type is E-Book
if ($item->Book_type === 'E-Book' && isset($_FILES['pdfFile'])) {
    
    if ($_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['message' => 'File upload error. Code: ' . $_FILES['pdfFile']['error']]);
        exit();
    }

    $upload_dir = '../../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_extension = strtolower(pathinfo($_FILES['pdfFile']['name'], PATHINFO_EXTENSION));
    
    if ($file_extension !== 'pdf') {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid file type. Only PDF files are allowed.']);
        exit();
    }

    $unique_filename = uniqid('book_', true) . '.pdf';
    $target_file = $upload_dir . $unique_filename;

    if (move_uploaded_file($_FILES['pdfFile']['tmp_name'], $target_file)) {
        // --- THIS IS THE FIX ---
        // Save the correct, web-accessible path from the project root
        $item->URL = 'backend/uploads/' . $unique_filename;
        $item->File_format = 'PDF'; // Set the file format
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to save the uploaded file.']);
        exit();
    }
}

// Attempt to create the book record in the database
if ($item->create()) {
    http_response_code(201);
    echo json_encode(['message' => 'Book Created Successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Book Not Created']);
}
?>