<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';

$database = new Database();
$db = $database->connect();

// Get the logged-in user's ID from the URL
$current_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

// This advanced query does the following:
// 1. Creates a temporary table (CTE) called "LatestMessage" that finds the single most recent message 
//    for every conversation involving the current user.
// 2. It then selects ALL users from the user table (except the current user).
// 3. It LEFT JOINS the latest message information. Users with no conversation will have NULL for message details.
// 4. It SORTS the results: first by the message time descending (placing recent chats at the top and users with no chats at the bottom),
//    and then by name ascending (to sort the users with no chats alphabetically).
$query = "
    WITH LatestMessage AS (
        SELECT 
            m.Message_content,
            m.sent_at,
            m.sender_id,
            m.receiver_id,
            ROW_NUMBER() OVER(
                PARTITION BY 
                    LEAST(m.sender_id, m.receiver_id), 
                    GREATEST(m.sender_id, m.receiver_id) 
                ORDER BY m.sent_at DESC
            ) as rn
        FROM message m
    )
    SELECT
        u.Student_id AS id,
        u.Name AS name,
        u.Role AS role,
        lm.Message_content AS last_message,
        lm.sent_at AS last_message_time
    FROM
        user u
    LEFT JOIN
        LatestMessage lm ON 
            ((u.Student_id = lm.sender_id AND :current_user_id = lm.receiver_id) OR 
             (u.Student_id = lm.receiver_id AND :current_user_id = lm.sender_id))
            AND lm.rn = 1
    WHERE
        u.Student_id != :current_user_id
    ORDER BY
        lm.sent_at DESC, u.Name ASC;
";

$stmt = $db->prepare($query);
$stmt->bindParam(':current_user_id', $current_user_id);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $conversations_arr = array();
    $conversations_arr['data'] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $conversation_item = array(
            'id' => $id,
            'name' => $name,
            'role' => $role,
            'last_message' => $last_message,
            'last_message_time' => $last_message_time
        );
        array_push($conversations_arr['data'], $conversation_item);
    }
    echo json_encode($conversations_arr);
} else {
    echo json_encode(array('data' => array()));
}
?>