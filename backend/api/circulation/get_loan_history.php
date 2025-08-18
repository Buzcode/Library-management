<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Loan.php';

$database = new Database();
$db = $database->getConnection();

$loan = new Loan($db);

// Get UserID from the query string
$userId = isset($_GET['userId']) ? $_GET['userId'] : die();

$stmt = $loan->getLoanHistoryByUser($userId);
$num = $stmt->rowCount();

if ($num > 0) {
    $loans_arr = array();
    $loans_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $loan_item = array(
            "IssueID" => $IssueID,
            "Title" => $Title,
            "Author" => $Author,
            "IssueDate" => $IssueDate,
            "ReturnDate" => $ReturnDate,
            "Status" => $Status
        );
        array_push($loans_arr["records"], $loan_item);
    }

    http_response_code(200);
    echo json_encode($loans_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No loan history found."));
}
?>