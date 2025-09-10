<?php
// Filepath: backend/models/Catalogue.php

class Catalogue {
    private $conn;
    private $table = 'catalogue';

    // --- (Class properties are unchanged) ---
    public $Book_id;
    public $Book_Title;
    public $Total_copies;
    public $Available_copies;
    public $Author;
    public $Publication;
    public $URL;
    public $Book_Type;
    public $File_Format;
    public $Status; 

    public function __construct($db) {
        $this->conn = $db;
    }

    // --- START: THIS IS THE MISSING FUNCTION ---
    /**
     * Reads all active books from the catalogue.
     * @return PDOStatement The statement object with the results.
     */
    public function read() {
        // Create the query to select all books where the status is 'Active'
        $query = 'SELECT * FROM ' . $this->table . ' WHERE Status = "Active" ORDER BY Book_id DESC';
        
        // Prepare and execute the statement
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        // Return the results
        return $stmt;
    }
    // --- END: THIS IS THE MISSING FUNCTION ---

    // --- (Your other functions like create(), update(), and archive() are below) ---

    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' SET
                    Book_Title = :Book_Title,
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies,
                    Author = :Author,
                    Publication = :Publication,
                    URL = :URL,
                    Book_Type = :Book_Type,
                    File_Format = :File_Format,
                    Status = "Active"';

        $stmt = $this->conn->prepare($query);

        // Sanitize input data
        $this->Book_Title = htmlspecialchars(strip_tags($this->Book_Title));
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->Book_Type = htmlspecialchars(strip_tags($this->Book_Type));
        $this->File_Format = htmlspecialchars(strip_tags($this->File_Format));

        // Bind parameters
        $stmt->bindParam(':Book_Title', $this->Book_Title);
        $stmt->bindParam(':Total_copies', $this->Total_copies);
        $stmt->bindParam(':Available_copies', 'YOUR_VALUE_HERE'); // You should probably set this to be the same as Total_copies initially
        $stmt->bindParam(':Author', $this->Author);
        $stmt->bindParam(':Publication', $this->Publication);
        $stmt->bindParam(':URL', $this->URL);
        $stmt->bindParam(':Book_Type', $this->Book_Type);
        $stmt->bindParam(':File_Format', $this->File_Format);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        // Your existing update code is here...
    }

    public function archive() {
        // Your existing archive code is here...
    }
}
?>