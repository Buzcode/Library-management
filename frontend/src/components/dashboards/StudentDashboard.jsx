import React, { useState } from 'react';

// Make sure these import paths correctly point to your component files.
import CatalogueView from '../CatalogueView'; 
import LoanHistory from '../LoanHistory';

const StudentDashboard = () => {
  // This state acts as a trigger. When it changes, LoanHistory will refresh.
  const [refreshKey, setRefreshKey] = useState(0);

  // This function is passed down to CatalogueView. 
  // When a book is borrowed, CatalogueView calls this function, which updates the state.
  const handleBookIssued = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-3">Student Dashboard</h2>
      <p className="lead text-muted">
        Welcome! Check your borrowing history or browse the library's collection below.
      </p>
      
      <hr className="my-4" />
      
      {/* 
        We pass the 'refreshKey' as a special 'key' prop.
        When this key changes, React will unmount the old LoanHistory instance 
        and mount a new one, forcing it to re-run its useEffect and fetch fresh data.
      */}
      <LoanHistory key={refreshKey} />
      
      <hr className="my-5" />

      {/* 
        We pass the callback function to CatalogueView. It will use this to notify
        the dashboard when a book has been issued successfully. We don't need to pass a 'key'
        here because CatalogueView is already set up to refresh its own list internally.
      */}
      <CatalogueView onBookIssued={handleBookIssued} />
    </div>
  );
};

export default StudentDashboard;