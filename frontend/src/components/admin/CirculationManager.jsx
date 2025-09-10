import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';

function CirculationManager({ onCirculationChange }) {
    const { user } = useAuth();
    const [issueData, setIssueData] = useState({ Book_id: '', Student_id: '' });
    
    const [returnData, setReturnData] = useState({ Book_id: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleIssueChange = (e) => {
        setIssueData({ ...issueData, [e.target.name]: e.target.value });
    };

    const handleReturnChange = (e) => {
        setReturnData({ ...returnData, [e.target.name]: e.target.value });
    };

    const handleIssueSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await axios.post('http://localhost/LIBRARY-MANAGEMENT/backend/api/circulation/issue.php', {
                ...issueData,
                Librarian_user_id: user.Student_id
            });
            setMessage({ text: 'Book issued successfully!', type: 'success' });
            onCirculationChange(); // Refresh parent's book list
            setIssueData({ Book_id: '', Student_id: '' });
        } catch (error) {
            setMessage({ text: 'Failed to issue book. Check IDs or availability.', type: 'danger' });
        }
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await axios.put('http://localhost/LIBRARY-MANAGEMENT/backend/api/circulation/return.php', returnData);
            setMessage({ text: 'Book returned successfully!', type: 'success' });
            onCirculationChange(); 
            setReturnData({ Book_id: '' });
        } catch (error) {
            setMessage({ text: 'Failed to return book. Check Book ID.', type: 'danger' });
        }
    };

    return (
        <div>
            {message.text && <Alert variant={message.type}>{message.text}</Alert>}
            <Row>
                <Col md={6}>
                    <h5>Issue a Book</h5>
                    <Form onSubmit={handleIssueSubmit}>
                        <Form.Group className="mb-3" controlId="issueBookId">
                            <Form.Label>Book ID</Form.Label>
                            <Form.Control type="number" name="Book_id" value={issueData.Book_id} onChange={handleIssueChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="issueStudentId">
                            <Form.Label>Student ID</Form.Label>
                            <Form.Control type="number" name="Student_id" value={issueData.Student_id} onChange={handleIssueChange} required />
                        </Form.Group>
                        <Button variant="success" type="submit">Issue Book</Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <h5>Return a Book</h5>
                    <Form onSubmit={handleReturnSubmit}>
                        <Form.Group className="mb-3" controlId="returnBookId">
                            <Form.Label>Book ID</Form.Label>
                            <Form.Control type="number" name="Book_id" value={returnData.Book_id} onChange={handleReturnChange} required />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="info" type="submit">Return Book</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default CirculationManager;