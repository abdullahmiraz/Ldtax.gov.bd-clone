import React from "react";

const UpdatePdfModal = ({ onClose, pdfFileName }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{`Update PDF: ${pdfFileName}`}</h2>
        {/* Add content for the modal as needed */}
      </div>
    </div>
  );
};

export default UpdatePdfModal;
