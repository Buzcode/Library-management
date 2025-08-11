<?php
// Filepath: backend/api/users/read_pending.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->connect();

$user = new User($db);

// Get pending users
$result = $user->readPending();
$num = $result->rowCount();

if ($num > 0) {
    $users_arr = [];
    $users_arr['data'] = [];

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $user_item = [
            'Student_id' => $Student_id,
            'Name' => $Name,
            'Email' => $Email,
            'Created_at' => $Created_at
        ];
        array_push($users_arr['data'], $user_item);
    }
    echo json_encode($users_arr);
} else {
    echo json_encode(['message' => 'No Pending Users Found']);
}
?>