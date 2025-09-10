import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Table, Alert, Spinner, Badge } from 'react-bootstrap';

const LoanHistory = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // We check for `user.Student_id` (lowercase 'd') to be consistent with the login process
    if (user?.Student_id) {
      const fetchLoanHistory = async () => {
        setLoading(true);
        try {
          // --- FIX #1: THE API URL ---
          // The parameter is now `userId` to match your get_loan_history.php script.
          const response = await axios.get(`http://localhost/library-management/backend/api/circulation/get_loan_history.php?userId=${user.Student_id}`);
          
          // --- FIX #2: THE DATA KEY ---
          // We now look for `response.data.records` to match the JSON from your PHP script.
          setLoans(response.data.records || []);
          setError('');
        } catch (err) {
          setError('Failed to fetch loan history.');
          console.error('Loan History API Error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchLoanHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusBadge = (status) => {
    if (status === 'Issued') return <Badge bg="primary">Issued</Badge>;
    if (status === 'Overdue') return <Badge bg="danger">Overdue</Badge>;
    if (status === 'Returned') return <Badge bg="success">Returned</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading history...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mt-5">
      <h4 className="mb-3">My Borrowing History</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                // --- FIX #3: THE DATA FIELDS ---
                // We now use the aliased names sent by the PHP API (e.g., IssueID, Title, IssueDate).
                <tr key={loan.IssueID}>
                  <td>{loan.Title}</td>
                  <td>{loan.Author}</td>
                  <td>{loan.IssueDate}</td>
                  <td>{loan.DueDate}</td>
                  <td>{loan.ReturnDate || 'Not Returned'}</td>
                  <td>{getStatusBadge(loan.Status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  You have no loan history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanHistory;