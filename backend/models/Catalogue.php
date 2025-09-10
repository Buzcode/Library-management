<?php

class Catalogue {
    private $conn;
    private $table = 'catalogue';

    // --- PROPERTIES USING YOUR ORIGINAL NAMING CONVENTION ---
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

    // --- Get all ACTIVE books from the catalogue ---
    public function read() {
        // NOTE: Make sure your database column names match this query (e.g., Book_id)
        $query = 'SELECT Book_id, Book_Title, Author, Publication, Available_copies, Total_copies, Book_Type
                  FROM ' . $this->table . '
                  WHERE Status = "Active"
                  ORDER BY Book_id DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // --- Create a new catalogue item ---
    public function create() {
        // Added Book_Title to the query
        $query = 'INSERT INTO ' . $this->table . ' SET
                    Book_Title = :Book_Title,
                    Total_copies = :Total_copies,
                    Available_copies = :Available_copies,
                    Author = :Author,
                    Publication = :Publication,
                    URL = :URL,
                    Book_Type = :Book_Type,
                    File_Format = :File_Format';

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->Book_Title = htmlspecialchars(strip_tags($this->Book_Title));
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->Book_Type = htmlspecialchars(strip_tags($this->Book_Type));
        $this->File_Format = htmlspecialchars(strip_tags($this->File_Format));

        // Bind data
        $stmt->bindParam(':Book_Title', $this->Book_Title);
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
        // Added Book_Title to the query
        $query = 'UPDATE ' . $this->table . ' SET
                    Book_Title = :Book_Title,
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
        $this->Book_Title = htmlspecialchars(strip_tags($this->Book_Title));
        $this->Total_copies = htmlspecialchars(strip_tags($this->Total_copies));
        $this->Available_copies = htmlspecialchars(strip_tags($this->Available_copies));
        $this->Author = htmlspecialchars(strip_tags($this->Author));
        $this->Publication = htmlspecialchars(strip_tags($this->Publication));
        $this->URL = htmlspecialchars(strip_tags($this->URL));
        $this->Book_Type = htmlspecialchars(strip_tags($this->Book_Type));
        $this->File_Format = htmlspecialchars(strip_tags($this->File_Format));
        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));

        // Bind data
        $stmt->bindParam(':Book_Title', $this->Book_Title);
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
        $query = 'UPDATE ' . $this->table . '
                  SET Status = "Archived"
                  WHERE Book_id = :Book_id';

        $stmt = $this->conn->prepare($query);

        $this->Book_id = htmlspecialchars(strip_tags($this->Book_id));
        $stmt->bindParam(':Book_id', $this->Book_id);

        if ($stmt->execute()) {
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // --- REPLACED METHOD FOR STUDENT DASHBOARD ---
    // --- REPLACE the existing readActive() method in your Catalogue.php model ---

public function readActive() {
   
    $query = 'SELECT
                b.Book_id AS Book_ID,
                b.Book_Title,
                b.Author,
                b.Publication,
                b.Total_copies AS Total_Copies,
                b.Available_copies AS Available_Copies,
                b.Book_type AS Book_Type,
                b.URL,
                b.File_format AS File_Format
              FROM
                ' . $this->table . ' b
              WHERE
                b.Status = "Active"
              ORDER BY
                b.Book_Title ASC';

    // Prepare statement
    $stmt = $this->conn->prepare($query);

    // Execute query
    $stmt->execute();

    return $stmt;
}
}
?>