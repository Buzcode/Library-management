// Filepath: frontend/src/components/admin/AddBookModal.jsx

import React, { useState } from 'react';
import axios from 'axios';

// The modal receives props to control its visibility and to refresh the book list
function AddBookModal({ show, onClose, onBookAdded }) {
    const initialState = {
        Author: '',
        Publication: '',
        Total_copies: 1,
        Available_copies: 1,
        Book_Type: 'Physical',
        URL: '',
        File_Format: ''
    };
    const [formData, setFormData] = useState(initialState);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // When total copies changes, available copies should match
        if (name === 'Total_copies') {
            setFormData({ ...formData, Total_copies: value, Available_copies: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await axios.post('http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/create.php', formData);
            setMessage({ text: 'Book added successfully!', type: 'success' });
            onBookAdded(); // This calls the function in the parent to refresh the list
            setFormData(initialState); // Reset form
            setTimeout(() => { // Close modal after a short delay
                onClose();
                setMessage({ text: '', type: '' });
            }, 1500);
        } catch (error) {
            setMessage({ text: 'Error adding book.', type: 'danger' });
            console.error('Error adding book:', error);
        }
    };

    // If the 'show' prop is false, don't render anything
    if (!show) {
        return null;
    }

    return (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Book</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Form fields for book details */}
                            <div className="mb-3">
                                <label className="form-label">Author</label>
                                <input type="text" name="Author" className="form-control" onChange={handleChange} value={formData.Author} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Publication Date</label>
                                <input type="date" name="Publication" className="form-control" onChange={handleChange} value={formData.Publication} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Total Copies</label>
                                <input type="number" name="Total_copies" className="form-control" onChange={handleChange} value={formData.Total_copies} min="1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Book Type</label>
                                <select name="Book_Type" className="form-select" onChange={handleChange} value={formData.Book_Type}>
                                    <option value="Physical">Physical</option>
                                    <option value="E-Book">E-Book</option>
                                </select>
                            </div>
                             {/* Conditionally show URL/Format for E-Books */}
                            {formData.Book_Type === 'E-Book' && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">URL</label>
                                        <input type="text" name="URL" className="form-control" onChange={handleChange} value={formData.URL} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">File Format</label>
                                        <input type="text" name="File_Format" className="form-control" onChange={handleChange} value={formData.File_Format} />
                                    </div>
                                </>
                            )}
                            
                            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                                <button type="submit" className="btn btn-primary">Save Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBookModal;