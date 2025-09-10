import React, { useState } from 'react';
import axios from 'axios';

function AddBookModal({ show, onClose, onBookAdded }) {
    // --- START: ADDED Book_Title AND PDF FILE STATE ---
    const initialState = {
        Book_Title: '',
        Author: '',
        Publication: '',
        Total_copies: 1,
        Book_Type: 'Physical'
    };
    const [formData, setFormData] = useState(initialState);
    const [pdfFile, setPdfFile] = useState(null); // New state to hold the selected file
    const [message, setMessage] = useState({ text: '', type: '' });
    // --- END: ADDED STATE ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]); // Get the first file selected
    };

    // --- START: REWRITTEN SUBMIT HANDLER FOR FILE UPLOADS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // FormData is required for sending files
        const submissionData = new FormData();

        // Append all text data
        submissionData.append('Book_Title', formData.Book_Title);
        submissionData.append('Author', formData.Author);
        submissionData.append('Publication', formData.Publication);
        submissionData.append('Total_copies', formData.Total_copies);
        submissionData.append('Book_Type', formData.Book_Type);

        // If it's an E-Book and a file has been selected, append the file
        if (formData.Book_Type === 'E-Book' && pdfFile) {
            submissionData.append('pdfFile', pdfFile);
        }

        try {
            await axios.post(
                'http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/create.php',
                submissionData,
                { headers: { 'Content-Type': 'multipart/form-data' } } // This header is essential
            );
            setMessage({ text: 'Book added successfully!', type: 'success' });
            onBookAdded(); // Refresh the main list
            setFormData(initialState); // Reset form fields
            setPdfFile(null); // Reset file input
            setTimeout(() => {
                onClose(); // Close modal after success
                setMessage({ text: '', type: '' });
            }, 1500);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error adding book.';
            setMessage({ text: errorMsg, type: 'danger' });
            console.error('Error adding book:', error);
        }
    };
    // --- END: REWRITTEN SUBMIT HANDLER ---

    if (!show) return null;

    return (
        <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(5px)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Book</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* --- START: ADDED NEW FIELDS TO THE FORM --- */}
                            <div className="mb-3">
                                <label className="form-label">Book Title</label>
                                <input type="text" name="Book_Title" className="form-control" onChange={handleChange} value={formData.Book_Title} required />
                            </div>
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
                                <input type="number" name="Total_copies" className="form-control" onChange={handleChange} value={formData.Total_copies} min="1" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Book Type</label>
                                <select name="Book_Type" className="form-select" onChange={handleChange} value={formData.Book_Type}>
                                    <option value="Physical">Physical</option>
                                    <option value="E-Book">E-Book</option>
                                </select>
                            </div>
                            
                            {/* Conditionally show PDF Upload for E-Books */}
                            {formData.Book_Type === 'E-Book' && (
                                <div className="mb-3 p-3 bg-light border rounded">
                                    <label className="form-label fw-bold">Upload PDF</label>
                                    <input type="file" name="pdfFile" className="form-control" onChange={handleFileChange} accept=".pdf" required />
                                </div>
                            )}
                            {/* --- END: ADDED NEW FIELDS TO THE FORM --- */}
                            
                            {message.text && <div className={`alert alert-${message.type} mt-3`}>{message.text}</div>}
                            
                            <div className="modal-footer border-top-0">
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