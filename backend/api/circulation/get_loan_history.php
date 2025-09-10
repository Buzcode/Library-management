<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once '../../config/Database.php';
include_once '../../models/Loan.php';

$database = new Database();
$db = $database->connect();
$loan = new Loan($db);

// Get UserID from the query string, matching your frontend's request
$userId = isset($_GET['userId']) ? $_GET['userId'] : die();

$stmt = $loan->getLoanHistoryByUser($userId);
$num = $stmt->rowCount();

if ($num > 0) {
    // This structure now matches your frontend's expectation
    $loans_arr = array();
    $loans_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        // --- DYNAMIC STATUS CALCULATION ---
        $status = '';
        if (is_null($ReturnDate)) {
            // If today's date is past the due date, it's Overdue
            $status = (date('Y-m-d') > $DueDate) ? 'Overdue' : 'Issued';
        } else {
            $status = 'Returned';
        }

        $loan_item = array(
            "IssueID" => $IssueID,
            "Title" => $Title,
            "Author" => $Author,
            "IssueDate" => $IssueDate,
            "ReturnDate" => $ReturnDate,
            "DueDate" => $DueDate, // Pass DueDate to the frontend
            "Status" => $status // Pass the dynamically calculated status
        );
        array_push($loans_arr["records"], $loan_item);
    }

    http_response_code(200);
    echo json_encode($loans_arr);
} else {
    // Return a 200 OK with an empty records array, which is easier for React to handle
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>