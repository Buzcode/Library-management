// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function RegisterPage() {
    const [formData, setFormData] = useState({ Name: '', Email: '', Password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('http://localhost/Library-management/backend/api/users/register.php', formData);
            setMessage({ text: response.data.message, type: 'success' });
        } catch (error) {
            setMessage({ text: 'Registration failed. Please try again.', type: 'danger' });
            console.error('There was an error registering!', error);
        }
    };

    return (
        <Container className="my-5">
            {/* This new outer Row's only job is to center the content block */}
            <Row className="justify-content-center">
                 {/* This new Col acts as a container for our two-column layout */}
                <Col lg={10} xl={9}>
                    <Row className="align-items-center">
                        {/* Left Column: Descriptive Text */}
                        <Col md={6} className="d-none d-md-block p-4">
                            <h1 className="display-4">Sign Up</h1>
                            <p className="lead">
                                Get your free library card and borrow digital books from our collection.
                            </p>
                        </Col>

                        {/* Right Column: Registration Form Card */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body className="p-4">
                                    <h2 className="text-center mb-4 d-md-none">Sign Up</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="registerName">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name"
                                                placeholder="Enter your full name"
                                                value={formData.Name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

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
                                            <Button variant="primary" type="submit" size="lg">
                                                Sign Up with Email
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
    );
}

export default RegisterPage;