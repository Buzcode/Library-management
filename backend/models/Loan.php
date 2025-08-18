<?php
class Loan {
    private $conn;
    private $table = 'book_issue';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getLoanHistoryByUser($userId) {
        $query = "SELECT
                    bi.IssueID,
                    c.Title,
                    c.Author,
                    bi.IssueDate,
                    bi.ReturnDate,
                    bi.Status
                  FROM
                    " . $this->table . " bi
                  JOIN
                    catalogue c ON bi.BookID = c.BookID
                  WHERE
                    bi.UserID = :userId
                  ORDER BY
                    bi.IssueDate DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();

        return $stmt;
    }
}
?>