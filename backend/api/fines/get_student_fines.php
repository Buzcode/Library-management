<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';

$database = new Database();
$db = $database->connect();

// Define your library's fine rate (e.g., $1.50 per day)
$fine_per_day = 1.50;

// Get the student ID from the URL
$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : die();

// The SQL query to find overdue books and calculate the fine
// CORRECTED table names to 'book_issue' and 'catalogue'
// CORRECTED the JOIN condition to use 'Catalogue_id'
$query = "
    SELECT 
        i.Issue_id,
        b.Title,
        b.Author,
        i.Issue_date,
        i.Due_date,
        -- Calculate the number of days overdue
        DATEDIFF(CURDATE(), i.Due_date) AS days_overdue,
        -- Calculate the total fine based on days overdue and the rate
        (DATEDIFF(CURDATE(), i.Due_date) * :fine_per_day) AS calculated_fine
    FROM 
        book_issue i
    JOIN 
        catalogue b ON i.Book_id = b.Catalogue_id 
    WHERE 
        i.Student_id = :student_id
        AND i.Return_date IS NULL         -- The book has not been returned
        AND i.Due_date < CURDATE()        -- The due date is in the past
        AND i.fine_status = 'unpaid'      -- The fine has not been paid yet
";

$stmt = $db->prepare($query);

// Bind the parameters
$stmt->bindParam(':student_id', $student_id);
$stmt->bindParam(':fine_per_day', $fine_per_day);

$stmt->execute();
$num = $stmt->rowCount();

if ($num > 0) {
    $fines_arr = array();
    $fines_arr['data'] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $fine_item = array(
            'issue_id' => $Issue_id,
            'title' => $Title,
            'author' => $Author,
            'issue_date' => $Issue_date,
            'due_date' => $Due_date,
            'days_overdue' => $days_overdue,
            'fine_amount' => number_format($calculated_fine, 2) // Format to 2 decimal places
        );
        array_push($fines_arr['data'], $fine_item);
    }
    echo json_encode($fines_arr);
} else {
    echo json_encode(array('data' => array())); // Return empty data array if no fines
}
?>