<?php
class Loan {
    private $conn;
    private $table = 'book_issue';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Fetches the loan history for a specific user, matching your frontend's needs.
     * @param int $userId The ID of the student.
     * @return PDOStatement The statement object with the results.
     */
    // --- START: FINAL CORRECTED CODE ---
    public function getLoanHistoryByUser($userId) {
        // This query has been updated to use the correct column names from your database schema
        $query = "SELECT
                    bi.Issue_id AS IssueID,
                    c.Book_Title AS Title,
                    c.Author,
                    bi.Issue_date AS IssueDate,
                    bi.Return_date AS ReturnDate,
                    bi.Due_date AS DueDate
                  FROM
                    " . $this->table . " bi
                  JOIN
                    catalogue c ON bi.Book_id = c.Book_id
                  WHERE
                    bi.Student_id = :userId
                  ORDER BY
                    bi.Issue_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();

        return $stmt;
    }
}
?>