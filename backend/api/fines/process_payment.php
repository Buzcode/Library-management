<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"));

// --- FIX: Added the missing logical OR (||) operators between each condition ---
if (
    empty($data->issue_id)     || 
    empty($data->student_id)   || 
    empty($data->librarian_id) || 
    !isset($data->amount)
) {
    http_response_code(400);
    echo json_encode(['message' => 'Incomplete data provided. Required fields: issue_id, student_id, librarian_id, amount.']);
    die();
}

try {
    // Start a transaction
    $db->beginTransaction();

    // First, update the book_issue table to mark the fine as paid
    $query_update = "UPDATE book_issue SET fine_status = 'paid', fine_amount = :amount WHERE Issue_id = :issue_id";
    $stmt_update = $db->prepare($query_update);
    $stmt_update->bindParam(':amount', $data->amount);
    $stmt_update->bindParam(':issue_id', $data->issue_id);

    if (!$stmt_update->execute()) {
        throw new Exception("Failed to update fine status.");
    }

    // Second, insert a record into the payment history table
    $query_insert = "INSERT INTO payment (student_id, librarian_user_id, Amount, Payment_date, status) 
                     VALUES (:student_id, :librarian_id, :amount, CURDATE(), 'completed')";
    $stmt_insert = $db->prepare($query_insert);
    
    $stmt_insert->bindParam(':student_id', $data->student_id);
    $stmt_insert->bindParam(':librarian_id', $data->librarian_id);
    $stmt_insert->bindParam(':amount', $data->amount);

    if (!$stmt_insert->execute()) {
        throw new Exception("Failed to insert payment record.");
    }

    // If both queries succeed, commit the transaction
    $db->commit();
    http_response_code(200);
    echo json_encode(['message' => 'Payment processed successfully.']);

} catch (Exception $e) {
    // If anything fails, roll back the transaction to prevent partial data changes
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['message' => 'Payment processing failed. ' . $e->getMessage()]);
}
?>