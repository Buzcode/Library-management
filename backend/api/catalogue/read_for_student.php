<?php
// THESE HEADERS MUST BE THE VERY FIRST LINES OF OUTPUT
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include database and book model
include_once '../../config/Database.php';
include_once '../../models/Catalogue.php';

// Instantiate and connect to the database
$database = new Database();
$db = $database->connect();

// Instantiate book object from the Catalogue class
$catalogue = new Catalogue($db);

// Execute the readActive method from the Catalogue object
$result = $catalogue->readActive();
$num = $result->rowCount();

// Check if any books are found
if ($num > 0) {
    $books_arr = [];
    $books_arr['data'] = [];

    // --- THIS IS THE CORRECTED LOGIC ---
    // We will now manually build the array to ensure the keys are correct.
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        // We no longer use extract(). Instead, we access the array keys directly.
        // These keys ('Book_ID', 'Book_Type') match the aliases in the SQL query.
        $book_item = [
            'Book_ID' => $row['Book_ID'],
            'Book_Title' => $row['Book_Title'],
            'Author' => $row['Author'],
            'Publication' => $row['Publication'],
            'Total_Copies' => $row['Total_Copies'],
            'Available_Copies' => $row['Available_Copies'],
            'Book_Type' => $row['Book_Type'],
            'URL' => $row['Book_Type'] === 'e-resource' ? $row['URL'] : null,
            'File_Format' => $row['Book_Type'] === 'e-resource' ? $row['File_Format'] : null,
        ];

        // Push book item to the data array
        array_push($books_arr['data'], $book_item);
    }

    // Convert to JSON and output
    http_response_code(200);
    echo json_encode($books_arr);
} else {
    // Return a 200 OK status with an empty data array, which is better for the frontend.
    http_response_code(200);
    echo json_encode(['data' => []]);
}
?>