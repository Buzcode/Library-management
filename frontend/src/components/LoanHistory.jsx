import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoanHistory = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.UserID) {
      const fetchLoanHistory = async () => {
        try {
          const response = await api.get(`/get_loan_history.php?userId=${user.UserID}`);
          setLoans(response.data.records || []);
        } catch (err) {
          setError('Failed to fetch loan history.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchLoanHistory();
    }
  }, [user]);

  if (loading) {
    return <p>Loading loan history...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Loan History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Author</th>
              <th className="py-2 px-4">Issue Date</th>
              <th className="py-2 px-4">Return Date</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.IssueID} className="border-b">
                  <td className="py-2 px-4">{loan.Title}</td>
                  <td className="py-2 px-4">{loan.Author}</td>
                  <td className="py-2 px-4">{loan.IssueDate}</td>
                  <td className="py-2 px-4">{loan.ReturnDate || 'Not Returned'}</td>
                  <td className="py-2 px-4">{loan.Status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
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