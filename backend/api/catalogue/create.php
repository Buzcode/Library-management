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

// --- START: REWRITTEN LOGIC FOR FORM DATA AND FILE UPLOADS ---

// Data from form fields will be in the $_POST superglobal
$item->Book_Title = $_POST['Book_Title'] ?? '';
$item->Author = $_POST['Author'] ?? '';
$item->Publication = $_POST['Publication'] ?? '';
$item->Total_copies = $_POST['Total_copies'] ?? 1;
// CRITICAL: Available copies should match total copies for a new book
$item->Available_copies = $_POST['Total_copies'] ?? 1; 
$item->Book_Type = $_POST['Book_Type'] ?? 'Physical';
// Set defaults for URL and File_Format
$item->URL = '';
$item->File_Format = '';

// Handle the PDF file upload if the book type is E-Book
if ($item->Book_Type === 'E-Book' && isset($_FILES['pdfFile'])) {
    
    // Check for upload errors
    if ($_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['message' => 'File upload error. Code: ' . $_FILES['pdfFile']['error']]);
        exit();
    }

    $upload_dir = '../../uploads/';
    // Create the directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_extension = strtolower(pathinfo($_FILES['pdfFile']['name'], PATHINFO_EXTENSION));
    
    // Server-side validation for PDF files
    if ($file_extension !== 'pdf') {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid file type. Only PDF files are allowed.']);
        exit();
    }

    // Create a unique filename to prevent overwrites
    $unique_filename = uniqid('book_', true) . '.pdf';
    $target_file = $upload_dir . $unique_filename;

    // Move the uploaded file to the destination
    if (move_uploaded_file($_FILES['pdfFile']['tmp_name'], $target_file)) {
        // Store the relative path in the database
        $item->URL = 'uploads/' . $unique_filename;
        $item->File_Format = 'PDF';
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

// --- END: REWRITTEN LOGIC ---
?>