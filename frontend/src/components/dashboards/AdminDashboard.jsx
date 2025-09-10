import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';

import UserApproval from '../admin/UserApproval';
import CatalogueManager from '../admin/CatalogueManager';
import CirculationManager from '../admin/CirculationManager';

function AdminDashboard() {
    
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    //fetch books, passed down to child components.
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

    // Fetch the books when the component first loads.
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <>
            <h1 className="h2 mb-4">Librarian Dashboard</h1>
            
            <Row>
                <Col lg={7} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Circulation Management</Card.Header>
                        <Card.Body>
                            {/* The onCirculationChange prop  triggers a refresh */}
                            <CirculationManager onCirculationChange={fetchBooks} />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">User Management</Card.Header>
                        <Card.Body>
                            <UserApproval />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Catalogue Management</Card.Header>
                        <Card.Body>
                            {/* Pass the state and the refresh function down as props */}
                            <CatalogueManager books={books} error={error} fetchBooks={fetchBooks} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default AdminDashboard;