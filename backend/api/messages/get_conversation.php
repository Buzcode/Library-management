<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include database
include_once '../../config/database.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Get the user IDs from the URL query string
// For example: get_conversation.php?user1_id=1&user2_id=3
$user1_id = isset($_GET['user1_id']) ? $_GET['user1_id'] : die(); // The logged-in user
$user2_id = isset($_GET['user2_id']) ? $_GET['user2_id'] : die(); // The user they are talking to

// Create query to get messages between the two users
$query = 'SELECT
            Message_id,
            Message_content,
            sent_at,
            sender_id,
            receiver_id
        FROM
            message
        WHERE
            (sender_id = :user1_id AND receiver_id = :user2_id)
        OR
            (sender_id = :user2_id AND receiver_id = :user1_id)
        ORDER BY
            sent_at ASC';

// Prepare statement
$stmt = $db->prepare($query);

// Sanitize and bind IDs
$user1_id = htmlspecialchars(strip_tags($user1_id));
$user2_id = htmlspecialchars(strip_tags($user2_id));
$stmt->bindParam(':user1_id', $user1_id);
$stmt->bindParam(':user2_id', $user2_id);

// Execute query
$stmt->execute();
$num = $stmt->rowCount();

if($num > 0) {
    $messages_arr = array();
    $messages_arr['data'] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $message_item = array(
            'id' => $Message_id,
            'content' => $Message_content,
            'sent_at' => $sent_at,
            'sender_id' => $sender_id,
            'receiver_id' => $receiver_id
        );

        array_push($messages_arr['data'], $message_item);
    }
    // Output as JSON
    echo json_encode($messages_arr);
} else {
    // No messages found
    echo json_encode(
        array('data' => array()) // Return an empty data array if no messages
    );
}

?>