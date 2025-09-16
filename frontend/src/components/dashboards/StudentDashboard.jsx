import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Table, Alert, Container } from 'react-bootstrap';

// Make sure these import paths correctly point to your component files.
import CatalogueView from '../CatalogueView';
import LoanHistory from '../LoanHistory';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [fines, setFines] = useState([]);
    const [loadingFines, setLoadingFines] = useState(true);

    // This useEffect will fetch the student's fines when the dashboard loads
    useEffect(() => {
        if (user) {
            const fetchFines = async () => {
                setLoadingFines(true);
                try {
                    const response = await fetch(`http://localhost/library-management/backend/api/fines/get_student_fines.php?student_id=${user.Student_id}`);
                    const data = await response.json();
                    setFines(data.data || []);
                } catch (error) {
                    console.error("Failed to fetch fines:", error);
                } finally {
                    setLoadingFines(false);
                }
            };
            fetchFines();
        }
    }, [user]); // It runs when the user object is available

    const handleBookIssued = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    // Calculate the total fine amount
    const totalFineAmount = fines.reduce((total, fine) => total + parseFloat(fine.fine_amount), 0).toFixed(2);

    return (
        <div className="dashboard-page">
            <Container className="py-4">
                <h2 className="mb-3">Student Dashboard</h2>
                <p className="lead text-muted">
                    Welcome! Check your fines, borrowing history, or browse the library's collection below.
                </p>
                
                <hr className="my-4" />
                
                {/* --- DYNAMIC FINES SECTION --- */}
                {loadingFines ? (
                    <p>Checking for outstanding fines...</p>
                ) : fines.length > 0 && (
                    <>
                        <Card className="mb-4 border-danger shadow-sm">
                            <Card.Header as="h3" className="bg-danger text-white">Outstanding Fines</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Book Title</th>
                                            <th>Author</th>
                                            <th>Due Date</th>
                                            <th>Days Overdue</th>
                                            <th className="text-end">Fine Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fines.map((fine) => (
                                            <tr key={fine.issue_id}>
                                                <td>{fine.title}</td>
                                                <td>{fine.author}</td>
                                                <td>{fine.due_date}</td>
                                                <td>{fine.days_overdue}</td>
                                                <td className="text-end">${fine.fine_amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="fw-bold">
                                            <td colSpan="4" className="text-end">Total Due:</td>
                                            <td className="text-end">${totalFineAmount}</td>
                                        </tr>
                                    </tfoot>
                                </Table>
                                <Alert variant="warning">
                                    Please visit the library front desk to pay your outstanding fines. Your borrowing privileges may be suspended.
                                </Alert>
                            </Card.Body>
                        </Card>
                        <hr className="my-4" />
                    </>
                )}
                {/* --- END OF FINES SECTION --- */}
                
                <LoanHistory key={refreshKey} />
          
                <hr className="my-5" />

                <CatalogueView onBookIssued={handleBookIssued} />
            </Container>
        </div>
    );
};

export default StudentDashboard;