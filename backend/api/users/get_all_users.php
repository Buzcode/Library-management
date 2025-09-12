<?php
// Headers for API
header('Access-Control-Allow-Origin: *'); // Allows access from any origin
header('Content-Type: application/json'); // Sets the content type to JSON

// Include database and model files
// Adjust the path '..' as necessary to point to your config folder
include_once '../../config/database.php'; 

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// The query to get all users
$query = 'SELECT Student_id, Name, Role FROM user';

// Prepare statement
$stmt = $db->prepare($query);

// Execute query
$stmt->execute();

// Get the number of rows
$num = $stmt->rowCount();

// Check if any users were found
if($num > 0) {
    // Create an array to hold the users
    $users_arr = array();
    $users_arr['data'] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_item = array(
            'id' => $Student_id,
            'name' => $Name,
            'role' => $Role
        );

        // Push to "data"
        array_push($users_arr['data'], $user_item);
    }

    // Turn to JSON & output
    echo json_encode($users_arr);

} else {
    // No Users found
    echo json_encode(
        array('message' => 'No users found')
    );
}
?>