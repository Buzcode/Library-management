import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BsBook, BsCalendarCheck, BsHeart } from 'react-icons/bs';

const HomePage = () => {
    return (
        <div>
            {/* Section 1: Welcome & Features */}
            <Container className="my-5 text-center">
                <h1 className="mb-3">Welcome to the Library</h1>
                <Row className="mt-5 justify-content-center">
                    {/* Feature 1 */}
                    <Col md={4} lg={3} className="mb-4">
                        <Card className="h-100 feature-card p-3">
                            <Card.Body>
                                <BsBook size={40} className="text-primary mb-3" />
                                <Card.Title as="h5">Read Free Library Books Online</Card.Title>
                                <Card.Text>
                                    Millions of books available through our digital lending system.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Feature 2 */}
                    <Col md={4} lg={3} className="mb-4">
                        <Card className="h-100 feature-card p-3">
                            <Card.Body>
                                <BsCalendarCheck size={40} className="text-primary mb-3" />
                                <Card.Title as="h5">Set a Yearly Reading Goal</Card.Title>
                                <Card.Text>
                                    Learn how to set a yearly reading goal and track what you read.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Feature 3 */}
                    <Col md={4} lg={3} className="mb-4">
                        <Card className="h-100 feature-card p-3">
                            <Card.Body>
                                <BsHeart size={40} className="text-primary mb-3" />
                                <Card.Title as="h5">Keep Track of your Favorite Books</Card.Title>
                                <Card.Text>
                                    Organize your Books using Lists & the Reading Log.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;