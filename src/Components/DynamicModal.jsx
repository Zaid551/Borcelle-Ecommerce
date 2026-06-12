import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckLg, ExclamationLg, XLg, BoxArrowRight, EmojiFrownFill, EmojiFrown } from 'react-bootstrap-icons';

const DynamicModal = ({ show, handleClose, isConfirm, handleConfirm, title, message, type, showInput, inputValue, setInputValue }) => {
  
  const isSuccess = type === 'success'
  const mainColor = isSuccess ? '#F0345D' : '#2B3445'
  const confirmColor = '#b50000'
  const activeColor = isConfirm ? confirmColor : mainColor
  useEffect(() => {
    if (show && !isConfirm && type === 'success') {
      const timer = setTimeout(() => {
        handleClose(); 
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, [show, handleClose, isConfirm, type]);

  if (!show) return null;
  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="border-0 overflow-hidden">
      <div className="text-center position-relative p-5" style={{ backgroundColor: activeColor }}>
        <button onClick={handleClose} className="position-absolute top-0 end-0 m-3 bg-transparent border-0 text-white">
          <XLg size={20} />
        </button>

        <div 
          className="cart-bump bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow"
          style={{ 
            width: '80px', 
            height: '80px', 
            border: `8px solid ${isConfirm ? '#ff0707' : (isSuccess ? '#28a745' : '#285fa7')}`
          }}>
          {isConfirm ? (
            <EmojiFrown size={40} style={{ color: confirmColor }} />
          ) : isSuccess ? (
            <CheckLg size={40} style={{ color: "#28a745" }} />
          ) : (
            <ExclamationLg size={40} style={{ color: '#2B3445' }} />
          )}
        </div>
      </div>

      <Modal.Body className="text-center p-4">
        <h4 className="fw-bold">{title}</h4>
        <p className="text-muted my-3">{message}</p>
        {showInput && (
          <textarea
            className="form-control mb-3"
            placeholder="Enter reason here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            style={{ borderRadius: '8px', borderColor: '#eee' }}
          />
        )}
        <div className={isConfirm ? "d-flex gap-2" : ""}>
          {isConfirm && (
            <Button variant="light" onClick={handleClose} className="w-100 py-2 fw-bold text-muted border">
              Cancel
            </Button>
          )}
          <Button 
            onClick={isConfirm ? handleConfirm : handleClose}
            className="w-100 py-2 border-0 fw-bold text-white" 
            style={{ backgroundColor: activeColor, borderRadius: '8px' }}>
            {isConfirm ? 'Confirm' : 'Continue'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DynamicModal;