<?php
// backend/config/database.php

class Database {
    // --- These are the credentials your PHP script will use ---
    private $host = 'localhost';
    private $db_name = 'library'; // Your database name in phpMyAdmin
    private $username = 'root';   // Corrected line: Your MySQL username
    private $password = 'rootpassword';       // Your MySQL password (usually blank for XAMPP)
    private $conn;

    // --- This function is what your API files will call ---
    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
?>