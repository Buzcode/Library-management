<?php
// Filepath: backend/api/catalogue/read.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Catalogue.php';

$database = new Database();
$db = $database->connect();
$catalogue = new Catalogue($db);

// --- FIX: Call the correct 'readAll()' method for the librarian ---
$result = $catalogue->readAll();
$num = $result->rowCount();

if ($num > 0) {
    $catalogue_arr = [];
    $catalogue_arr['data'] = [];

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row); 

        // Note: Make sure these keys match your database column names exactly
        $item = [
            'Book_id' => $Book_id,
            'Book_Title' => $Book_Title,
            'Author' => $Author,
            'Publication' => $Publication,
            'Available_copies' => $Available_copies,
            'Total_copies' => $Total_copies,
            'Book_Type' => isset($Book_type) ? $Book_type : (isset($Book_Type) ? $Book_Type : null),
            'URL' => $URL,
            'File_Format' => isset($File_format) ? $File_format : (isset($File_Format) ? $File_Format : null),
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