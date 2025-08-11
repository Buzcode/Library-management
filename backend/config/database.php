<?php
// backend/config/database.php

class Database {
    private $host = 'localhost';
    private $db_name = 'library';
    private $username = 'root';
    private $password = '';
    private $conn;

    // The fix is removing ": ?PDO" from this line
    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            // You can uncomment this line during debugging if you want to see connection errors
            // echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
?>