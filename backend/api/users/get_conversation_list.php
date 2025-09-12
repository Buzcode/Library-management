<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';

$database = new Database();
$db = $database->connect();

$current_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

// This is the corrected and robust query.
// It uses two CTEs (temporary tables) to first find the latest message for each conversation,
// and then separately determine if that conversation contains any unread messages.
$query = "
    WITH ConversationPartners AS (
        SELECT
            LEAST(sender_id, receiver_id) as user1,
            GREATEST(sender_id, receiver_id) as user2,
            MAX(sent_at) as max_sent_at,
            -- This correctly checks if the conversation has any unread messages for the current user
            MAX(CASE WHEN receiver_id = :current_user_id AND is_read = 0 THEN 1 ELSE 0 END) as is_unread
        FROM message
        WHERE sender_id = :current_user_id OR receiver_id = :current_user_id
        GROUP BY user1, user2
    ),
    LatestMessages AS (
        SELECT 
            m.Message_content,
            m.sent_at,
            LEAST(m.sender_id, m.receiver_id) as user1,
            GREATEST(m.sender_id, m.receiver_id) as user2
        FROM message m
        INNER JOIN ConversationPartners cp ON m.sent_at = cp.max_sent_at
            AND LEAST(m.sender_id, m.receiver_id) = cp.user1
            AND GREATEST(m.sender_id, m.receiver_id) = cp.user2
    )
    SELECT
        u.Student_id AS id,
        u.Name AS name,
        u.Role AS role,
        lm.Message_content AS last_message,
        cp.max_sent_at AS last_message_time,
        cp.is_unread
    FROM
        user u
    LEFT JOIN
        ConversationPartners cp ON u.Student_id = (CASE WHEN cp.user1 = :current_user_id THEN cp.user2 ELSE cp.user1 END)
    LEFT JOIN
        LatestMessages lm ON cp.user1 = lm.user1 AND cp.user2 = lm.user2
    WHERE
        u.Student_id != :current_user_id
    ORDER BY
        last_message_time DESC, u.Name ASC;
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
            'last_message_time' => $last_message_time,
            'is_unread' => $is_unread
        );
        array_push($conversations_arr['data'], $conversation_item);
    }
    echo json_encode($conversations_arr);
} else {
    echo json_encode(array('data' => array()));
}
?>