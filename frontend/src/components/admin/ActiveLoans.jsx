import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const ActiveLoans = ({ onLoanChange }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // A reusable function to fetch the list of active loans from the new API endpoint
    const fetchActiveLoans = useCallback(async () => {
        setLoading(true);
        try {
            // This is the new API endpoint we created
            const response = await axios.get('http://localhost/LIBRARY-MANAGEMENT/backend/api/circulation/get_active_loans.php');
            setLoans(response.data.records || []); // Expects a 'records' key from the API
            setError('');
        } catch (err) {
            setError('Could not fetch the list of active loans.');
            console.error("Fetch active loans error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch the loans when the component first loads
    useEffect(() => {
        fetchActiveLoans();
    }, [fetchActiveLoans]);

    // This function is called when the librarian clicks the "Mark as Returned" button
    const handleReturn = async (issueId) => {
        // Ask for confirmation before performing the action
        if (!window.confirm('Are you sure you want to mark this book as returned?')) {
            return;
        }
        try {
            // Send the request to your updated 'return.php' script
            await axios.post('http://localhost/LIBRARY-MANAGEMENT/backend/api/circulation/return.php', {
                issue_id: issueId // Send the unique loan ID
            });
            
            // 1. Refresh this component's list of active loans
            fetchActiveLoans();
            
            // 2. Notify the parent dashboard that a change happened
            if (onLoanChange) {
                onLoanChange();
            }
        } catch (err) {
            alert('Failed to return the book. Please check the console and try again.');
            console.error("Return book error:", err);
        }
    };

    if (loading) return <div className="text-center my-3"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="mt-4">
            <h6 className="mb-3">Currently Issued Books</h6>
            <Table striped bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Student Name</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.length > 0 ? (
                        loans.map((loan) => (
                            <tr key={loan.IssueID}>
                                <td>{loan.Title}</td>
                                <td>{loan.StudentName}</td>
                                <td>{loan.IssueDate}</td>
                                <td>{loan.DueDate}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleReturn(loan.IssueID)}
                                    >
                                        Mark as Returned
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No books are currently issued.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ActiveLoans;