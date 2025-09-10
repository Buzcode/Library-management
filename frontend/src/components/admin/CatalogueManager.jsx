import React, { useState } from 'react';
import axios from 'axios';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

function CatalogueManager({ books, error, fetchBooks }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);
    const [bookToDelete, setBookToDelete] = useState(null);

    const handleEditClick = (book) => {
        setBookToEdit(book);
        setShowEditModal(true);
    };

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
            fetchBooks();
        } catch (err) {
            console.error("Error deleting book:", err);
            setShowDeleteModal(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Manage Catalogue</h4>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Book</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* --- START: UPDATED THE TABLE --- */}
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Book Title</th>
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
                                <td>{book.Book_Title}</td>
                                <td>{book.Author}</td>
                                <td>{book.Publication}</td>
                                <td>{book.Book_Type}</td>
                                <td>{book.Available_copies}</td>
                                <td>{book.Total_copies}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(book)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(book)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="text-center">No books found in the catalogue.</td></tr>
                    )}
                </tbody>
            </table>
            {/* --- END: UPDATED THE TABLE --- */}

            <AddBookModal show={showAddModal} onClose={() => setShowAddModal(false)} onBookAdded={fetchBooks} />
            <EditBookModal show={showEditModal} onClose={() => setShowEditModal(false)} onBookUpdated={fetchBooks} book={bookToEdit} />
            <ConfirmDeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={executeDelete} itemName={bookToDelete ? bookToDelete.Book_Title : ''} />
        </div>
    );
}

export default CatalogueManager;