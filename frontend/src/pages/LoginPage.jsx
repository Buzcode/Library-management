import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function LoginPage() {
    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('http://localhost/Library-management/backend/api/users/login.php', formData);
            if (response.data.data) {
                login(response.data.data);
                navigate('/dashboard');
            } else {
                setMessage({ text: response.data.message, type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Login failed. Please check your credentials.', type: 'danger' });
            console.error('There was an error logging in!', error);
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
                            <h1 className="display-4">Log In</h1>
                            <p className="lead">
                                Log in to use your free library card to borrow digital books and manage your account.
                            </p>
                        </Col>

                        {/* Right Column: Login Form Card */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body className="p-4">
                                    <h2 className="text-center mb-4 d-md-none">Log In</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="loginEmail">
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

                                        <Form.Group className="mb-3" controlId="loginPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="Password"
                                                placeholder="Enter your password"
                                                value={formData.Password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <div className="d-grid mt-4">
                                            <Button variant="primary" type="submit" size="lg">
                                                Log In
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

export default LoginPage;