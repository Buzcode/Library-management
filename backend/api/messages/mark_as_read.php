<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../config/database.php';
$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->receiver_id) && !empty($data->sender_id)) {
    // Query to mark all messages from a specific sender to the receiver as read
    $query = "UPDATE message SET is_read = 1 WHERE receiver_id = :receiver_id AND sender_id = :sender_id AND is_read = 0";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':receiver_id', $data->receiver_id);
    $stmt->bindParam(':sender_id', $data->sender_id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Messages marked as read']);
    } else {
        echo json_encode(['message' => 'Failed to mark messages as read']);
    }
}
?>