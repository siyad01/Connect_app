// Modal.js
import React from 'react';

// eslint-disable-next-line react/prop-types
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-600 hover:text-gray-800">
          &times; {/* Close button */}
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
