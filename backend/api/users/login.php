<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {

        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    }
    
    exit(0);
}
// --- END OF DEFINITIVE CORS & PREFLIGHT HANDLING ---

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->connect();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// Check for complete data
if (!empty($data->Email) && !empty($data->Password)) {
    $user->Email = $data->Email;
    $user->Password = $data->Password;

    // Attempt to log the user in
    if ($user->login()) {
        // Create an array with user info to send back
        $user_info = [
            'Student_id' => $user->Student_id,
            'Name' => $user->Name,
            'Email' => $user->Email,
            'Role' => $user->Role
        ];
        // Send a success response with the user data
        echo json_encode([
            'message' => 'Login Successful',
            'data' => $user_info
        ]);
    } else {
        // Login failed
        echo json_encode(['message' => 'Login Failed. Check credentials or account status.']);
    }
} else {
    // Incomplete data
    echo json_encode(['message' => 'Incomplete data. Please provide Email and Password.']);
}
?>