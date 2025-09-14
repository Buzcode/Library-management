import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';

// Make sure these paths are correct for your project
import UserApproval from '../admin/UserApproval';
import CatalogueManager from '../admin/CatalogueManager';
import ActiveLoans from '../admin/ActiveLoans';

// --- NEW: Import the FinesManagement component ---
import FinesManagement from '../FinesManagement';

function AdminDashboard() {
    
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    const fetchBooks = useCallback(async () => {
        try {
            setError(''); 
            const response = await axios.get('http://localhost/LIBRARY-MANAGEMENT/backend/api/catalogue/read.php');
            setBooks(response.data.data || []);
        } catch (err) {
            setError('Could not fetch the book catalogue.');
            console.error("Error fetching books:", err);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <>
            <h1 className="h2 mb-4">Librarian Dashboard</h1>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Circulation Management</Card.Header>
                        <Card.Body>
                            <ActiveLoans onLoanChange={fetchBooks} />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">User Management</Card.Header>
                        <Card.Body>
                            <UserApproval />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- NEW: Fines Management Section --- */}
            {/* I've added this new Row to hold the Fines component. */}
            {/* It is completely independent of your other components. */}
            <Row className="mb-4">
                <Col>
                    <FinesManagement />
                </Col>
            </Row>
            {/* --- END OF NEW SECTION --- */}

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Catalogue Management</Card.Header>
                        <Card.Body>
                            <CatalogueManager books={books} error={error} fetchBooks={fetchBooks} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default AdminDashboard;