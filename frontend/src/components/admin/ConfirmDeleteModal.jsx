// Filepath: frontend/src/components/admin/ConfirmDeleteModal.jsx

import React from 'react';

function ConfirmDeleteModal({ show, onClose, onConfirm, itemName }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Deletion</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete the item: <strong>{itemName}</strong>?</p>
                        <p className="text-danger">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        {/* *** THIS IS THE CRITICAL LINE *** */}
                        {/* It ensures that clicking this button calls the onConfirm function passed down from CatalogueManager */}
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Confirm Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;