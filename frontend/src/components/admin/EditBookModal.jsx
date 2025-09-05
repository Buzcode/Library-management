import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditBookModal({ show, onClose, onBookUpdated, book }) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });

  
    useEffect(() => {
        if (book) {
            setFormData(book);
        }
    }, [book]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/update.php', formData);
            setMessage({ text: 'Book updated successfully!', type: 'success' });
            onBookUpdated(); // Refresh the list in the parent
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            setMessage({ text: 'Error updating book.', type: 'danger' });
        }
    };

    if (!show) return null;

    return (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Book (ID: {formData.Book_id})</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                            <div className="mb-3">
                                <label className="form-label">Author</label>
                                <input type="text" name="Author" className="form-control" onChange={handleChange} value={formData.Author || ''} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Publication Date</label>
                                <input type="date" name="Publication" className="form-control" onChange={handleChange} value={formData.Publication || ''} />
                            </div>
                        
                            <div className="mb-3">
                                <label className="form-label">Total Copies</label>
                                <input type="number" name="Total_copies" className="form-control" onChange={handleChange} value={formData.Total_copies || ''} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Available Copies</label>
                                <input type="number" name="Available_copies" className="form-control" onChange={handleChange} value={formData.Available_copies || ''} />
                            </div>
                            
                            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBookModal;