import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        // --- MODIFICATION START ---
        // Frontend validation for immediate user feedback.
        if (!formData.Email.endsWith('@aust.edu')) {
            setMessage({ text: 'Registration is restricted to @aust.edu email addresses.', type: 'danger' });
            return; // Stop the submission if the email is not valid
        }
        // --- MODIFICATION END ---

        setLoading(true);

        const dataToSend = {
            ...formData,
            UserType: 'Student'
        };

        try {
            const response = await axios.post('http://localhost/library-management/backend/api/users/register.php', dataToSend);
            setMessage({ text: response.data.message, type: 'success' });
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage({ text: errorMessage, type: 'danger' });
            console.error('There was an error registering!', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- CHANGE: Added this wrapper div with the 'auth-page' class ---
        <div className="auth-page">
            <Container> {/* Removed my-5 as auth-page now controls spacing */}
                <Row className="justify-content-center">
                    <Col lg={10} xl={9}>
                        <Row className="align-items-center">
                            <Col md={6} className="d-none d-md-block p-4">
                                <h1 className="display-4">Sign Up</h1>
                                <p className="lead">
                                    Get your free library card and borrow digital books from our collection.
                                </p>
                            </Col>

                            <Col md={6}>
                                <Card className="shadow-sm">
                                    <Card.Body className="p-4">
                                        <h2 className="text-center mb-4 d-md-none">Sign Up</h2>
                                        <Form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="registerFirstName">
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="FirstName"
                                                            placeholder="Enter first name"
                                                            value={formData.FirstName}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="registerLastName">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="LastName"
                                                            placeholder="Enter last name"
                                                            value={formData.LastName}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3" controlId="registerEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="Email"
                                                    placeholder="Enter your email"
                                                    value={formData.Email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="registerPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="Password"
                                                    placeholder="Create a password"
                                                    value={formData.Password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>

                                            <div className="d-grid mt-4">
                                                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Sign Up with Email'}
                                                </Button>
                                            </div>
                                        </Form>
                                        {message.text && (
                                            <Alert variant={message.type} className="mt-3">
                                                {message.text}
                                            </Alert>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default RegisterPage;