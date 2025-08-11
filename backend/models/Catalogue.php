<?php
// Filepath: backend/models/Catalogue.php

class Catalogue {
    private $conn;
    private $table = 'catalogue';

    // Properties from your 'catalogue' table
    public $Book_id;
    public $Total_copies;
    public $Available_copies;
    public $Author;
    public $Publication;
    public $URL;
    public $Book_Type;
    public $File_Format;
    public $Status; // Include the new Status property

    public function __construct($db) {
        $this->conn = $db;
    }

    // --- Get all ACTIVE books from the catalogue ---
    public function read() {
        // The query is now updated to only fetch books with 'Active' status
        $query = 'SELECT Book_id, Author, Publication, Available_copies, Total_copies, Book_Type
                  FROM ' . $this->table . '
                  WHERE Status = "Active"
                  ORDER BY Book_id DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // --- Create a new catalogue item ---
    public function create() {
        // Book_id is not included because it's auto-incrementing
        // Status is not included because the database sets its DEFAULT to 'Active'
        $query = 'INSERT INTO ' . $this->table . ' SET
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies,
                    Author = :Author,
                    Publication = :Publication,
                    URL = :URL,
                    Book_Type = :Book_Type,
                    File_Format = :File_Format';

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->Book_Type = htmlspecialchars(strip_tags($this->Book_Type));
        $this->File_Format = htmlspecialchars(strip_tags($this->File_Format));

        // Bind data
        $stmt->bindParam(':Total_copies', $this->Total_copies);
        $stmt->bindParam(':Available_copies', $this->Available_copies);
        $stmt->bindParam(':Author', $this->Author);
        $stmt->bindParam(':Publication', $this->Publication);
        $stmt->bindParam(':URL', $this->URL);
        $stmt->bindParam(':Book_Type', $this->Book_Type);
        $stmt->bindParam(':File_Format', $this->File_Format);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // --- Update a catalogue item ---
    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies,
                    Author = :Author,
                    Publication = :Publication,
                    URL = :URL,
                    Book_Type = :Book_Type,
                    File_Format = :File_Format
                  WHERE
                    Book_id = :Book_id';

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->Book_Type = htmlspecialchars(strip_tags($this->Book_Type));
        $this->File_Format = htmlspecialchars(strip_tags($this->File_Format));
        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));

        // Bind data
        $stmt->bindParam(':Total_copies', $this->Total_copies);
        $stmt->bindParam(':Available_copies', $this->Available_copies);
        $stmt->bindParam(':Author', $this->Author);
        $stmt->bindParam(':Publication', $this->Publication);
        $stmt->bindParam(':URL', $this->URL);
        $stmt->bindParam(':Book_Type',  $this->Book_Type);
        $stmt->bindParam(':File_Format', $this->File_Format);
        $stmt->bindParam(':Book_id', $this->Book_id);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }
    
    // --- Archive a catalogue item (soft delete) ---
    public function archive() {
        // Create query to update the status to 'Archived'
        $query = 'UPDATE ' . $this->table . '
                  SET Status = "Archived"
                  WHERE Book_id = :Book_id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Sanitize the ID
        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));

        // Bind the ID
        $stmt->bindParam(':Book_id', $this->Book_id);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}
?>