<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/Database.php';
include_once '../../models/Loan.php';

$database = new Database();
$db = $database->connect();
$loan = new Loan($db);

$stmt = $loan->getAllActiveLoans();
$num = $stmt->rowCount();

if ($num > 0) {
    $loans_arr = array();
    $loans_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $loan_item = array(
            "IssueID" => $IssueID,
            "StudentName" => $StudentName,
            "Title" => $Title,
            "IssueDate" => $IssueDate,
            "DueDate" => $DueDate
        );
        array_push($loans_arr["records"], $loan_item);
    }

    http_response_code(200);
    echo json_encode($loans_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>