<?php

class BookIssue {
    private $conn;
    private $issue_table = 'book_issue';
    private $catalogue_table = 'catalogue';

    // Properties from your 'book_issue' table
    public $Book_id;
    public $Student_id;
    public $Librarian_user_id;
    public $Issue_date;
    public $Due_date;

    public function __construct($db) {
        $this->conn = $db;
    }

    // --- (The 'issue' and 'returnBook' methods are unchanged) ---
    public function issue() { /* ... your existing code ... */ }
    public function returnBook() { /* ... your existing code ... */ }


    // --- START: MODIFIED FUNCTION WITH ERROR LOGGING ---
    public function issueBookByStudent($studentId, $bookId) {
        $this->conn->beginTransaction();

        try {
            // Step 1: Decrement available copies in the catalogue.
            $query1 = "UPDATE " . $this->catalogue_table . "
                       SET Available_copies = Available_copies - 1
                       WHERE Book_id = :book_id AND Available_copies > 0";
            
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindParam(':book_id', $bookId);
            $stmt1->execute();

            if ($stmt1->rowCount() == 0) {
                // --- ADDED DEBUGGING LOG ---
                // This tells you if the failure is because the book is out of stock.
                error_log("Book issue failed at Step 1: Book ID {$bookId} is out of stock or does not exist.");
                $this->conn->rollBack();
                return false;
            }

            // Step 2: Insert the new loan record.
            $query2 = "INSERT INTO " . $this->issue_table . " SET
                        Student_id = :student_id,
                        Book_id = :book_id,
                        Issue_date = CURDATE(),
                        Due_date = DATE_ADD(CURDATE(), INTERVAL 14 DAY)";
            
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(':student_id', $studentId);
            $stmt2->bindParam(':book_id', $bookId);
            $stmt2->execute();

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            // --- THIS IS THE MOST IMPORTANT DEBUGGING LOG ---
            // It will record the EXACT error message from the database (e.g., foreign key violation).
            error_log("DATABASE ERROR in issueBookByStudent: " . $e->getMessage());
            // --- END IMPORTANT DEBUGGING LOG ---

            $this->conn->rollBack();
            return false;
        }
    }
    // --- END: MODIFIED FUNCTION ---
}
?>