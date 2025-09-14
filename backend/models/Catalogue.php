<?php
// Filepath: backend/models/Catalogue.php

class Catalogue {
    private $conn;
    private $table = 'catalogue';

    // Class properties that EXACTLY MATCH your database column names
    public $Book_id;
    public $Book_Title;
    public $Author;
    public $Publication;
    public $Total_copies;
    public $Available_copies;
    public $Book_type;
    public $URL;
    public $File_format;
    public $Status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // --- (readAll, readActive, and create methods are unchanged) ---

    public function readAll() {
        $query = 'SELECT * FROM ' . $this->table . ' ORDER BY Book_id DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readActive() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE Status = :status ORDER BY Book_id DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':status', 'Active');
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' SET
                    Book_Title = :Book_Title,
                    Author = :Author,
                    Publication = :Publication,
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies,
                    Book_type = :Book_type,
                    URL = :URL,
                    File_format = :File_format,
                    Status = "Active"';

        $stmt = $this->conn->prepare($query);

        // Sanitize and bind data...
        $this->Book_Title = htmlspecialchars(strip_tags($this->Book_Title));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Book_type = htmlspecialchars(strip_tags($this->Book_type));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->File_format = htmlspecialchars(strip_tags($this->File_format));

        $stmt->bindParam(':Book_Title', $this->Book_Title);
        $stmt->bindParam(':Author', $this->Author);
        $stmt->bindParam(':Publication', $this->Publication);
        $stmt->bindParam(':Total_copies', $this->Total_copies);
        $stmt->bindParam(':Available_copies', $this->Available_copies);
        $stmt->bindParam(':Book_type', $this->Book_type);
        $stmt->bindParam(':URL', $this->URL);
        $stmt->bindParam(':File_format', $this->File_format);

        if ($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function delete() {
        // Create the DELETE query
        $query = 'DELETE FROM ' . $this->table . ' WHERE Book_id = :Book_id';

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Sanitize the ID
        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));

        // Bind the ID parameter
        $stmt->bindParam(':Book_id', $this->Book_id);

        // Execute the query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // --- START: THIS IS THE NEWLY ADDED FUNCTION ---
    /**
     * Updates a book record in the database.
     * @return bool True if update is successful, false otherwise.
     */
    public function update() {
        // Create the UPDATE query
        // Note: It's assumed Book_Title and Status are not changed via this form,
        // but you could add them if needed.
        $query = 'UPDATE ' . $this->table . ' SET
                    Author = :Author,
                    Publication = :Publication,
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies
                  WHERE
                    Book_id = :Book_id';

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Sanitize input data
        $this->Author           = htmlspecialchars(strip_tags($this->Author));
        $this->Publication      = htmlspecialchars(strip_tags($this->Publication));
        $this->Total_copies     = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Book_id          = htmlspecialchars(strip_tags($this->Book_id));

        // Bind parameters
        $stmt->bindParam(':Author', $this->Author);
        $stmt->bindParam(':Publication', $this->Publication);
        $stmt->bindParam(':Total_copies', $this->Total_copies);
        $stmt->bindParam(':Available_copies', $this->Available_copies);
        $stmt->bindParam(':Book_id', $this->Book_id);

        // Execute the query
        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    // --- END: THIS IS THE NEWLY ADDED FUNCTION ---
}
?>