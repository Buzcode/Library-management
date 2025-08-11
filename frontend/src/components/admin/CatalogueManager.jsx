// Filepath: frontend/src/components/admin/CatalogueManager.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddBookModal from './AddBookModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditBookModal from './EditBookModal'; // 1. Import the Edit modal

function CatalogueManager() {
    // State for data and errors
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    // State for controlling modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // 2. Add state for Edit modal

    // State to hold the specific book for an action
    const [bookToDelete, setBookToDelete] = useState(null);
    const [bookToEdit, setBookToEdit] = useState(null); // 3. Add state for the book to edit

    // Function to fetch all active books from the API
    const fetchBooks = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/read.php');
            setBooks(response.data.data || []);
        } catch (err) {
            setError('Could not fetch the book catalogue.');
            console.error("Error fetching books:", err);
        }
    }, []);

    // Fetch books when the component first loads
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // --- Handlers for Delete Functionality ---
    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        if (!bookToDelete) return;
        try {
            await axios.delete('http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/delete.php', {
                data: { Book_id: bookToDelete.Book_id }
            });
            setShowDeleteModal(false);
            setBookToDelete(null);
            fetchBooks(); // Refresh the list
        } catch (err) {
            setError('Could not delete the book. Please try again.');
            console.error("Error deleting book:", err);
            setShowDeleteModal(false);
        }
    };

    // 4. Handler for Edit Functionality
    const handleEditClick = (book) => {
        setBookToEdit(book);
        setShowEditModal(true);
    };


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Manage Catalogue</h4>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Book</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Author</th>
                        <th>Publication Date</th>
                        <th>Type</th>
                        <th>Available</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map(book => (
                            <tr key={book.Book_id}>
                                <td>{book.Book_id}</td>
                                <td>{book.Author}</td>
                                <td>{book.Publication}</td>
                                <td>{book.Book_Type}</td>
                                <td>{book.Available_copies}</td>
                                <td>{book.Total_copies}</td>
                                <td>
                                    {/* 5. Update the Edit button */}
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEditClick(book)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteClick(book)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No books found in the catalogue.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Render all the modals */}
            <AddBookModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onBookAdded={fetchBooks}
            />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={executeDelete}
                itemName={bookToDelete ? bookToDelete.Author : ''}
            />

            {/* 6. Render the new Edit modal */}
            <EditBookModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onBookUpdated={fetchBooks}
                book={bookToEdit}
            />
        </div>
    );
}

export default CatalogueManager;