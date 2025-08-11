-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2025 at 06:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `book_issue`
--

CREATE TABLE `book_issue` (
  `Student_id` int(11) NOT NULL,
  `librarian_user_id` int(11) NOT NULL,
  `Issue_id` int(11) NOT NULL,
  `Issue_date` int(11) NOT NULL,
  `Return_date` int(11) NOT NULL,
  `Due_date` int(11) NOT NULL,
  `Book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catalogue`
--

CREATE TABLE `catalogue` (
  `Book_id` int(11) NOT NULL,
  `Total_copies` int(11) NOT NULL,
  `Available_copies` int(11) NOT NULL,
  `Author` varchar(255) NOT NULL,
  `Publication` date NOT NULL,
  `URL` varchar(2048) NOT NULL,
  `Book_type` int(100) NOT NULL,
  `File_format` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `Message_id` int(11) NOT NULL,
  `Message_content` text NOT NULL,
  `sent_at` datetime NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `Payment_id` int(11) NOT NULL,
  `status` enum('Paid','Unpaid') NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Payment_date` datetime NOT NULL,
  `librarian_user_id` int(11) NOT NULL,
  `Student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Student_id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Created_at` date NOT NULL,
  `Status` enum('Pending','Approved') NOT NULL,
  `Role` varchar(50) NOT NULL DEFAULT 'Student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book_issue`
--
ALTER TABLE `book_issue`
  ADD PRIMARY KEY (`Issue_id`),
  ADD KEY `Book_id` (`Book_id`),
  ADD KEY `Librarian_id` (`librarian_user_id`),
  ADD KEY `Student_id` (`Student_id`);

--
-- Indexes for table `catalogue`
--
ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`Book_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`Message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`Payment_id`),
  ADD KEY `Librarian_id` (`librarian_user_id`),
  ADD KEY `Student_id` (`Student_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Student_id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book_issue`
--
ALTER TABLE `book_issue`
  MODIFY `Issue_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `catalogue`
--
ALTER TABLE `catalogue`
  MODIFY `Book_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `Message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `Payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `Student_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_issue`
--
ALTER TABLE `book_issue`
  ADD CONSTRAINT `fk_bookissue_book` FOREIGN KEY (`Book_id`) REFERENCES `catalogue` (`Book_id`),
  ADD CONSTRAINT `fk_bookissue_librarian_user` FOREIGN KEY (`librarian_user_id`) REFERENCES `user` (`Student_id`),
  ADD CONSTRAINT `fk_bookissue_user` FOREIGN KEY (`Student_id`) REFERENCES `user` (`Student_id`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_receiver_id` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`Student_id`),
  ADD CONSTRAINT `fk_sender_id` FOREIGN KEY (`sender_id`) REFERENCES `user` (`Student_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_librarian_user` FOREIGN KEY (`librarian_user_id`) REFERENCES `user` (`Student_id`),
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`Student_id`) REFERENCES `user` (`Student_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
