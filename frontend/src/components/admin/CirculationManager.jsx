// Filepath: frontend/src/components/admin/CirculationManager.jsx (Updated for Alignment)

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function CirculationManager({ onCirculationChange }) {
    // ... (all your state and handlers remain exactly the same)
    const { user } = useAuth();
    const [issueData, setIssueData] = useState({ Book_id: '', Student_id: '' });
    const [returnData, setReturnData] = useState({ Book_id: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleIssueSubmit = async (e) => { /* ... */ };
    const handleReturnSubmit = async (e) => { /* ... */ };
    const handleIssueChange = (e) => { /* ... */ };
    const handleReturnChange = (e) => { /* ... */ };

    return (
        <div>
            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            
            <div className="row">
                {/* Issue Form - takes up half the space */}
                <div className="col-md-6 border-end pe-3">
                    <h4 className="h6">Issue a Book</h4>
                    <form onSubmit={handleIssueSubmit}>
                        <div className="mb-3">
                            <label className="form-label small">Book ID</label>
                            <input type="number" name="Book_id" className="form-control form-control-sm" value={issueData.Book_id} onChange={handleIssueChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small">Student ID</label>
                            <input type="number" name="Student_id" className="form-control form-control-sm" value={issueData.Student_id} onChange={handleIssueChange} required />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Issue Book</button>
                    </form>
                </div>

                {/* Return Form - takes up the other half */}
                <div className="col-md-6 ps-3">
                    <h4 className="h6">Return a Book</h4>
                    <form onSubmit={handleReturnSubmit}>
                        <div className="mb-3">
                            <label className="form-label small">Book ID</label>
                            <input type="number" name="Book_id" className="form-control form-control-sm" value={returnData.Book_id} onChange={handleReturnChange} required />
                        </div>
                        <button type="submit" className="btn btn-info w-100 mt-4">Return Book</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CirculationManager;