import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback for optimization
import { useAuth } from '../context/AuthContext';
import { Button, Table, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';

function FinesManagement() {
    const { user: librarian } = useAuth();
    const [view, setView] = useState('summary'); // 'summary' or 'details'
    const [finesSummary, setFinesSummary] = useState([]);
    const [detailedFines, setDetailedFines] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Using useCallback to memoize the function, preventing re-creation on every render
    const fetchAllFines = useCallback(async () => {
        setLoading(true);
        try {
            // FIX: The URL is now a valid string wrapped in backticks
            const response = await fetch(`http://localhost/library-management/backend/api/fines/get_all_fines.php`);
            const data = await response.json();
            // FIX: Corrected the syntax to provide a fallback empty array
            setFinesSummary(data.data || []);
        } catch (err) {
            setError('Failed to load fines summary.');
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means this function is created only once

    useEffect(() => {
        // Fetch the summary when the component first loads
        fetchAllFines();
    }, [fetchAllFines]); // useEffect now depends on the stable fetchAllFines function

    const handleViewDetails = async (student) => {
        setLoading(true);
        setSelectedStudent(student);
        try {
            const response = await fetch(`http://localhost/library-management/backend/api/fines/get_student_fines.php?student_id=${student.Student_id}`);
            const data = await response.json();
            // FIX: Corrected the syntax to provide a fallback empty array
            setDetailedFines(data.data || []);
            setView('details');
        } catch (err) {
            setError('Failed to fetch fine details for this student.');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePayFine = async (fine) => {
        // FIX: The confirmation message is now a valid string
        if (!window.confirm(`Are you sure you want to mark the fine for "${fine.title}" as paid?`)) return;
        try {
            // FIX: The URL is now a valid string
            const response = await fetch(`http://localhost/library-management/backend/api/fines/process_payment.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issue_id: fine.issue_id,
                    student_id: selectedStudent.Student_id,
                    librarian_id: librarian.Student_id, // Ensure librarian object has this ID
                    amount: fine.fine_amount
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setMessage(result.message);
            // Instantly remove the paid fine from the details view
            setDetailedFines(prevFines => prevFines.filter(f => f.issue_id !== fine.issue_id));
        } catch (err) {
            // FIX: The error message is now a valid template string
            setError(`Payment failed: ${err.message}`);
        }
    };

    const backToSummary = () => {
        setView('summary');
        setSelectedStudent(null);
        setDetailedFines([]);
        // Re-fetch the summary list to reflect any changes
        fetchAllFines();
    };

    // Main loading spinner for the summary view
    if (loading && view === 'summary') {
        return <Spinner animation="border" />;
    }

    return (
        <Card className="shadow-sm">
            <Card.Header as="h5">
                <Row className="align-items-center">
                    {/* FIX: The title is now a valid template string */}
                    <Col>{view === 'summary' ? 'Outstanding Fines Summary' : `Fines for ${selectedStudent?.student_name}`}</Col>
                    {view === 'details' && (
                        <Col xs="auto">
                            <Button variant="outline-secondary" size="sm" onClick={backToSummary}>&larr; Back to Summary</Button>
                        </Col>
                    )}
                </Row>
            </Card.Header>
            <Card.Body>
                {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                {view === 'summary' && (
                    finesSummary.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th className="text-end">Total Fine Due</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finesSummary.map(s => (
                                    <tr key={s.Student_id}>
                                        <td>{s.Student_id}</td>
                                        <td>{s.student_name}</td>
                                        <td className="text-end">${s.total_fine}</td>
                                        <td className="text-center">
                                            <Button size="sm" onClick={() => handleViewDetails(s)}>View Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : <p>No outstanding fines found for any student.</p>
                )}

                {view === 'details' && (
                    loading ? <Spinner animation="border" /> :
                    detailedFines.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Days Overdue</th>
                                    <th className="text-end">Fine Amount</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailedFines.map(fine => (
                                    <tr key={fine.issue_id}>
                                        <td>{fine.title}</td>
                                        <td>{fine.days_overdue}</td>
                                        <td className="text-end">${fine.fine_amount}</td>
                                        <td className="text-center">
                                            <Button variant="success" size="sm" onClick={() => handlePayFine(fine)}>Mark as Paid</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : <p>All fines for this student have been cleared.</p>
                )}
            </Card.Body>
        </Card>
    );
}

export default FinesManagement;