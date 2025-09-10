<?php
// Filepath: backend/api/catalogue/read.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();
$catalogue = new Catalogue($db);

$result = $catalogue->read();
$num = $result->rowCount();

if ($num > 0) {
    $catalogue_arr = [];
    $catalogue_arr['data'] = [];

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        // This function creates variables like $Book_id, $Book_Title, $Book_type, $File_format, etc.
        extract($row); 

        $item = [
            'Book_id' => $Book_id,
            'Book_Title' => $Book_Title,
            'Author' => $Author,
            'Publication' => $Publication,
            'Available_copies' => $Available_copies,
            'Total_copies' => $Total_copies,
            
            // First fix: Match the 'Book_type' column name
            'Book_Type' => $Book_type,
            
            'URL' => $URL,
            
            // --- THIS IS THE FINAL FIX ---
            // Second fix: Match the 'File_format' column name
            'File_Format' => $File_format,
            
            'Status' => $Status
        ];
        array_push($catalogue_arr['data'], $item);
    }
    http_response_code(200);
    echo json_encode($catalogue_arr);
} else {
    http_response_code(200);
    echo json_encode(['data' => []]);
}
?>