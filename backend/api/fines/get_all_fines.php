<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';

$database = new Database();
$db = $database->connect();

$fine_per_day = 1.50;

// This query finds all unpaid fines, groups them by student, and calculates the total for each student.
$query = "
    SELECT
        u.Student_id,
        u.Name AS student_name,
        SUM(DATEDIFF(CURDATE(), i.Due_date) * :fine_per_day) AS total_fine
    FROM
        book_issue i
    JOIN
        user u ON i.Student_id = u.Student_id
    WHERE
        i.fine_status = 'unpaid' AND i.Due_date < CURDATE()
    GROUP BY
        u.Student_id, u.Name
    ORDER BY
        u.Name ASC
";

$stmt = $db->prepare($query);
$stmt->bindParam(':fine_per_day', $fine_per_day);
$stmt->execute();

$fines_summary = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['total_fine'] = number_format($row['total_fine'], 2);
    array_push($fines_summary, $row);
}

echo json_encode(['data' => $fines_summary]);
?>