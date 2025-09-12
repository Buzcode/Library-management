<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include database
include_once '../../config/database.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check if data is complete
if (
    !isset($data->sender_id) ||
    !isset($data->receiver_id) ||
    !isset($data->message_content)
) {
    echo json_encode(array('message' => 'Message not sent. Incomplete data.'));
    die();
}

// Set properties from the received data
$sender_id = $data->sender_id;
$receiver_id = $data->receiver_id;
$message_content = $data->message_content;

// Create query
$query = 'INSERT INTO message (sender_id, receiver_id, Message_content) VALUES (:sender_id, :receiver_id, :message_content)';

// Prepare statement
$stmt = $db->prepare($query);

// Sanitize data
$sender_id = htmlspecialchars(strip_tags($sender_id));
$receiver_id = htmlspecialchars(strip_tags($receiver_id));
$message_content = htmlspecialchars(strip_tags($message_content));

// Bind data
$stmt->bindParam(':sender_id', $sender_id);
$stmt->bindParam(':receiver_id', $receiver_id);
$stmt->bindParam(':message_content', $message_content);

// Execute query
if($stmt->execute()) {
    echo json_encode(
        array('message' => 'Message Sent')
    );
} else {
    echo json_encode(
        array('message' => 'Message Not Sent')
    );
}
?>