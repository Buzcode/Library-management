<?php
// Filepath: backend/api/catalogue/read.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// --- These two lines are essential ---
include_once '../../config/database.php';
include_once '../../models/Catalogue.php'; // <--- THIS LINE IS THE FIX

$database = new Database();
$db = $database->connect();

// This is line 13, where the error occurred
$catalogue = new Catalogue($db);

$result = $catalogue->read();
$num = $result->rowCount();

if ($num > 0) {
    $catalogue_arr = [];
    $catalogue_arr['data'] = [];

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $item = [
            'Book_id' => $Book_id,
            'Author' => $Author,
            'Publication' => $Publication,
            'Available_copies' => $Available_copies,
            'Total_copies' => $Total_copies,
            'Book_Type' => $Book_Type
        ];
        array_push($catalogue_arr['data'], $item);
    }
    echo json_encode($catalogue_arr);
} else {
    echo json_encode(['message' => 'No Books Found in Catalogue']);
}
?>