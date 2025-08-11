<?php
// Filepath: backend/models/BookIssue.php

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

    public function issue() {
        // 1. First, check if the book is available
        $check_query = 'SELECT Available_copies FROM ' . $this->catalogue_table . ' WHERE Book_id = :Book_id AND Available_copies > 0';
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(':Book_id', $this->Book_id);
        $check_stmt->execute();

        if ($check_stmt->rowCount() == 0) {
            // Book is not available or doesn't exist
            return false;
        }

        // 2. If available, proceed with the transaction
        try {
            // Start the transaction
            $this->conn->beginTransaction();

            // INSERT into book_issue table
            $issue_query = 'INSERT INTO ' . $this->issue_table . ' SET
                                Book_id = :Book_id,
                                Student_id = :Student_id,
                                Librarian_user_id = :Librarian_user_id,
                                Issue_date = :Issue_date,
                                Due_date = :Due_date';
            $issue_stmt = $this->conn->prepare($issue_query);

            // Sanitize data
            $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));
            $this->Student_id = htmlspecialchars(strip_tags($this->Student_id));
            $this->Librarian_user_id = htmlspecialchars(strip_tags($this->Librarian_user_id));

            // Set dates
            $this->Issue_date = date('Y-m-d');
            $this->Due_date = date('Y-m-d', strtotime('+14 days')); // Example: Due in 14 days

            // Bind data
            $issue_stmt->bindParam(':Book_id', $this->Book_id);
            $issue_stmt->bindParam(':Student_id', $this->Student_id);
            $issue_stmt->bindParam(':Librarian_user_id', $this->Librarian_user_id);
            $issue_stmt->bindParam(':Issue_date', $this->Issue_date);
            $issue_stmt->bindParam(':Due_date', $this->Due_date);
            $issue_stmt->execute();

            // UPDATE the catalogue to decrement available copies
            $update_query = 'UPDATE ' . $this->catalogue_table . ' SET Available_copies = Available_copies - 1 WHERE Book_id = :Book_id';
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(':Book_id', $this->Book_id);
            $update_stmt->execute();

            // If both queries were successful, commit the transaction
            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            // If any part fails, roll back the transaction
            $this->conn->rollBack();
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }
    // Add this new method inside the BookIssue class in backend/models/BookIssue.php

// --- Return a book ---
public function returnBook() {
    // We only need the Book_id to process a return in this simple model.
    // A more complex system might also require the Student_id.

    try {
        // Start the transaction
        $this->conn->beginTransaction();

        // UPDATE the book_issue table by setting the return date
        // This assumes only one copy of a book can be borrowed by a user at a time
        // and we are marking the first open loan for that book as returned.
        $return_query = 'UPDATE ' . $this->issue_table . '
                         SET Return_date = :Return_date
                         WHERE Book_id = :Book_id AND Return_date IS NULL
                         LIMIT 1'; // Use LIMIT 1 to prevent updating multiple records
        $return_stmt = $this->conn->prepare($return_query);

        // Sanitize data and set return date
        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));
        $return_date = date('Y-m-d');

        // Bind data
        $return_stmt->bindParam(':Return_date', $return_date);
        $return_stmt->bindParam(':Book_id', $this->Book_id);
        $return_stmt->execute();

        // Check if the update actually changed a row. If not, the book wasn't checked out.
        if ($return_stmt->rowCount() == 0) {
            $this->conn->rollBack();
            return false; // No open loan found for this book to return
        }

        // UPDATE the catalogue to increment available copies
        $update_query = 'UPDATE ' . $this->catalogue_table . ' SET Available_copies = Available_copies + 1 WHERE Book_id = :Book_id';
        $update_stmt = $this->conn->prepare($update_query);
        $update_stmt->bindParam(':Book_id', $this->Book_id);
        $update_stmt->execute();

        // If both queries were successful, commit the transaction
        $this->conn->commit();
        return true;

    } catch (Exception $e) {
        // If any part fails, roll back the transaction
        $this->conn->rollBack();
        printf("Error: %s.\n", $e->getMessage());
        return false;
    }
}
}
?>