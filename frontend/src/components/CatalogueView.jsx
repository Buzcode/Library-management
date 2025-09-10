import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert, Spinner, FormControl, InputGroup, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const CatalogueView = ({ onBookIssued }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [borrowStatus, setBorrowStatus] = useState({ message: '', type: '' });

  // This function can now be reused
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost/Library-management/backend/api/catalogue/read_for_student.php');
      setBooks(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Could not fetch the book catalogue.');
      console.error('API Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    if (!user || !user.Student_id) {
      setBorrowStatus({ message: 'You must be logged in to borrow a book.', type: 'danger' });
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost/Library-management/backend/api/circulation/issue_by_student.php',
        {
          student_id: user.Student_id,
          book_id: bookId
        }
      );
      setBorrowStatus({ message: response.data.message, type: 'success' });

      // --- THIS IS THE KEY PART ---
      if (onBookIssued) {
        onBookIssued(); // 1. Tell the parent dashboard to refresh the loan history
      }
      fetchBooks(); // 2. (IMPROVEMENT) Immediately refresh this catalogue list to update "Available copies"

      // Clear success message after 5 seconds
      setTimeout(() => {
        setBorrowStatus({ message: '', type: '' });
      }, 5000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while borrowing.';
      setBorrowStatus({ message: errorMessage, type: 'danger' });
    }
  };

  const filteredBooks = books.filter(book =>
    (book.Book_Title && book.Book_Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.Author && book.Author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-4">
      <h4>Library Collection</h4>
      {borrowStatus.message && (
        <Alert variant={borrowStatus.type} onClose={() => setBorrowStatus({ message: '', type: '' })} dismissible className="mt-3">
          {borrowStatus.message}
        </Alert>
      )}
      <InputGroup className="my-3">
        <FormControl
          placeholder="Search catalogue by title or author..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const bookType = book.Book_Type || book.Book_type;
              const availableCopies = book.Available_Copies || book.Available_copies;
              const totalCopies = book.Total_Copies || book.Total_copies;
              const bookId = book.Book_ID || book.Book_id;

              return (
                <tr key={bookId}>
                  <td>{book.Book_Title}</td>
                  <td>{book.Author}</td>
                  <td>{bookType?.toLowerCase() === 'physical' ? 'Physical' : 'E-Resource'}</td>
                  <td>
                    {bookType?.toLowerCase() === 'physical'
                      ? `${availableCopies} of ${totalCopies} available`
                      : 'Online'}
                  </td>
                  <td>
                    {bookType?.toLowerCase() === 'physical' ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleBorrow(bookId)}
                        disabled={availableCopies < 1}
                      >
                        {availableCopies < 1 ? 'Out of Stock' : 'Borrow'}
                      </Button>
                    ) : (
                      book.URL ? (
                        <a href={book.URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                          Open Link
                        </a>
                      ) : 'In Library'
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="5" className="text-center">No books found.</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CatalogueView;