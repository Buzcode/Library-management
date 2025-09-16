import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './HomePage.css';

// CORRECTED IMAGE IMPORTS:
// Go up one directory (from src/pages to src/), then into assets/
import man1 from '../assets/man1.jpg';
import man2 from '../assets/man2.jpg';
import man3 from '../assets/man3.jpg';
import man4 from '../assets/man4.jpg';
import man5 from '../assets/man5.jpg';




const HomePage = () => {
    return (
        <div className="homepage-content">
            {/* Main Welcome Section */}
            

            {/* Quotes Section */}
            <div className="quotes-section py-5">
                <Container fluid className="px-0"> {/* Use fluid container and remove horizontal padding */}
                    <h2 className="text-center mb-2">Read Today, Shape Tomorrow</h2>
                    {/* New lines with smaller font */}
                    <p className="text-center small-text mb-4">Every shelf is a universe, waiting for you to open its sky.</p>
                    <p className="text-center small-text mb-5">In the library, you don't just borrow books—you borrow lives, centuries, and dreams.</p>
                    
                    <Row className="justify-content-center mx-0"> {/* Remove horizontal margins */}
                        <Col md={8} className="px-0"> {/* Remove horizontal padding from column */}
                            {/* Quote 1 */}
                            <div className="quote-item no-box d-flex align-items-center mb-4">
                                <img src={man1} alt="Frederick Douglass" className="quote-author-img me-4" />
                                <div>
                                    <p className="mb-1">"A book is proof that humans are capable of working magic."</p>
                                    <p className="text-end fw-bold mb-0">— Frederick Douglass</p>
                                </div>
                            </div>
                            {/* Quote 2 */}
                            <div className="quote-item no-box d-flex align-items-center mb-4">
                                <img src={man2} alt="Albert Einstein" className="quote-author-img me-4" />
                                <div>
                                    <p className="mb-1">"If you want your children to be intelligent, read them fairy tales. If you want them to be more intelligent, read them more fairy tales."</p>
                                    <p className="text-end fw-bold mb-0">— Albert Einstein</p>
                                </div>
                            </div>
                            {/* Quote 3 */}
                            <div className="quote-item no-box d-flex align-items-center mb-4">
                                <img src={man3} alt="Emanuel James Rohn " className="quote-author-img me-4" />
                                <div>
                                    <p className="mb-1">"It isn't what the book costs. It's what it will cost you if you don't read it."</p>
                                    <p className="text-end fw-bold mb-0">— Emanuel James Rohn </p>
                                </div>
                            </div>
                             {/* Quote 4 */}
                            <div className="quote-item no-box d-flex align-items-center mb-4">
                                <img src={man4} alt="Theodor Seuss Geise" className="quote-author-img me-4" />
                                <div>
                                    <p className="mb-1">"The more that you read, the more things you will know. The more that you learn, the more places you'll go."</p>
                                    <p className="text-end fw-bold mb-0">— Theodor Seuss Geise </p>
                                </div>
                            </div>
                            {/* Quote 5 */}
                            <div className="quote-item no-box d-flex align-items-center mb-4">
                                <img src={man5} alt="Jorge Francisco Isidoro Luis Borges" className="quote-author-img me-4" />
                                <div>
                                    <p className="mb-1">"I think of reading a book as no less an experience than travelling or falling in love."</p>
                                    <p className="text-end fw-bold mb-0">— Jorge Francisco Isidoro Luis Borges </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Footer Section */}
            <div className="footer-section py-4 text-center">
                <Container fluid> {/* Use fluid container here too */}
                    <h3 className="mb-3">Contact Us</h3>
                    <p className="mb-1">Phone: 01721111111</p>
                    <p className="mb-0">Email: yourlibrary@gmail.com</p>
                </Container>
            </div>
        </div>
    );
};

export default HomePage;