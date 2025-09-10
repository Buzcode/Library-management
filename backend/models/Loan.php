<?php
class Loan {
    private $conn;
    private $table = 'book_issue';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getLoanHistoryByUser($userId) {
        // This function is correct and does not need changes.
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

    // --- START: CORRECTED FUNCTION FOR LIBRARIAN DASHBOARD ---
    public function getAllActiveLoans() {
        // --- THIS IS THE FIX ---
        // We now select `u.Name` instead of `u.Username` to match your 'user' table structure.
        $query = "SELECT 
                    bi.Issue_id AS IssueID,
                    u.Name AS StudentName, 
                    c.Book_Title AS Title,
                    bi.Issue_date AS IssueDate,
                    bi.Due_date AS DueDate
                  FROM 
                    " . $this->table . " bi
                  JOIN 
                    user u ON bi.Student_id = u.Student_id
                  JOIN 
                    catalogue c ON bi.Book_id = c.Book_id
                  WHERE 
                    bi.Return_date IS NULL
                  ORDER BY 
                    bi.Due_date ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    // --- END: CORRECTED FUNCTION ---

    // This function for returning a book is correct and does not need changes.
    public function returnBookByIssueId($issueId) {
        $this->conn->beginTransaction();

        try {
            $bookIdQuery = "SELECT Book_id FROM " . $this->table . " WHERE Issue_id = :issue_id";
            $bookIdStmt = $this->conn->prepare($bookIdQuery);
            $bookIdStmt->bindParam(':issue_id', $issueId);
            $bookIdStmt->execute();
            
            $result = $bookIdStmt->fetch(PDO::FETCH_ASSOC);
            if (!$result) {
                $this->conn->rollBack();
                return false;
            }
            $bookId = $result['Book_id'];

            $updateLoanQuery = "UPDATE " . $this->table . " 
                                SET Return_date = CURDATE() 
                                WHERE Issue_id = :issue_id AND Return_date IS NULL";
            $updateLoanStmt = $this->conn->prepare($updateLoanQuery);
            $updateLoanStmt->bindParam(':issue_id', $issueId);
            $updateLoanStmt->execute();

            if ($updateLoanStmt->rowCount() == 0) {
                 $this->conn->rollBack();
                 return false;
            }

            $updateCatalogueQuery = "UPDATE catalogue 
                                     SET Available_copies = Available_copies + 1 
                                     WHERE Book_id = :book_id";
            $updateCatalogueStmt = $this->conn->prepare($updateCatalogueQuery);
            $updateCatalogueStmt->bindParam(':book_id', $bookId);
            $updateCatalogueStmt->execute();
            
            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Return Book Error: " . $e->getMessage());
            return false;
        }
    }
}
?>