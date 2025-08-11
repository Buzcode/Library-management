import React from 'react';
import UserApproval from '../admin/UserApproval';
import CatalogueManager from '../admin/CatalogueManager'; // 1. Import the new component

function AdminDashboard() {
    return (
        <div>
            <h1 className="mb-4">Librarian Dashboard</h1>
            
            {/* User Management Panel */}
            <div className="card mb-4">
                <div className="card-header">
                    <h3>User Management</h3>
                </div>
                <div className="card-body">
                    <UserApproval />
                </div>
            </div>

            {/* 2. Add the Catalogue Management Panel */}
            <div className="card">
                <div className="card-header">
                    <h3>Catalogue Management</h3>
                </div>
                <div className="card-body">
                    <CatalogueManager />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;