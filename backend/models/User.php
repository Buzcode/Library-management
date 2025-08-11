<?php
// Filepath: backend/models/User.php

class User {
    private $conn;
    private $table = 'user';

    // Properties
    public $Student_id;
    public $Name;
    public $Password;
    public $Email;
    public $Status = 'Pending';
    public $Role = 'Student';

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // --- Create New User Method ---
    public function create() {
        $query = 'INSERT INTO ' . $this->table . '
                  SET Name = :Name, Email = :Email, Password = :Password, Status = :Status, Role = :Role';

        $stmt = $this->conn->prepare($query);

        $this->Name = htmlspecialchars(strip_tags($this->Name));
        $this->Email = htmlspecialchars(strip_tags($this->Email));
        $this->Password = password_hash($this->Password, PASSWORD_BCRYPT);

        $stmt->bindParam(':Name', $this->Name);
        $stmt->bindParam(':Email', $this->Email);
        $stmt->bindParam(':Password', $this->Password);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':Role', $this->Role);

        if ($stmt->execute()) {
            return true;
        }

        // --- Corrected Error Handling ---
        $errorInfo = $stmt->errorInfo();
        printf("Error: %s.\n", $errorInfo[2]);

        return false;
    }

    // --- User Login Method ---
    public function login() {
        $query = 'SELECT Student_id, Name, Email, Password, Status, Role
                  FROM ' . $this->table . '
                  WHERE Email = :Email
                  LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':Email', $this->Email);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row['Status'] == 'Approved' && password_verify($this->Password, $row['Password'])) {
                $this->Student_id = $row['Student_id'];
                $this->Name = $row['Name'];
                $this->Role = $row['Role'];
                return true;
            }
        }
        return false;
    }

    // --- Get all pending users ---
    public function readPending() {
        $query = 'SELECT Student_id, Name, Email, Created_at FROM ' . $this->table . ' WHERE Status = "Pending"';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // --- Approve a user ---
    public function approve() {
        $query = 'UPDATE ' . $this->table . ' SET Status = "Approved" WHERE Student_id = :Student_id';

        $stmt = $this->conn->prepare($query);

        $this->Student_id = htmlspecialchars(strip_tags($this->Student_id));
        $stmt->bindParam(':Student_id', $this->Student_id);

        if ($stmt->execute()) {
            return true;
        }

        // --- Corrected Error Handling ---
        $errorInfo = $stmt->errorInfo();
        printf("Error: %s.\n", $errorInfo[2]);
        
        return false;
    }
}
?>