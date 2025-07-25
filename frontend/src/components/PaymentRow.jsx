import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentRow = ({ payment, fetchPayments, openModal, isMobile }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/payments/${payment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Payment deleted successfully');
      fetchPayments();
    } catch (err) {
      toast.error('Delete failed');
      console.error('Delete failed', err);
    } finally {
      setConfirmDelete(false);
    }
  };

  const trStyle = {
    backgroundColor: '#fdfdfd',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '14px',
    color: '#333',
    fontSize: '0.95rem',
    userSelect: 'none',
    cursor: 'default',
    display: isMobile ? 'block' : 'table-row',
  };

  const tdStyleBase = {
    padding: '16px 14px',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '0.92rem',
    fontWeight: '500',
  };

  // Updated mobile cell style: vertical stack label & value
  const tdMobileStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 14px',
    borderBottom: '1px solid #eee',
  };

  // New label style for mobile: uppercase, green, small font, spaced nicely
  const labelStyle = {
    fontWeight: '600',
    fontSize: '0.8rem',
    color: '#4CAF50',
    marginBottom: '4px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const valueStyle = {
    fontWeight: '500',
    color: '#222',
    fontSize: '0.95rem',
  };

  const statusStyle = {
    padding: '6px 12px',
    borderRadius: '14px',
    backgroundColor:
      payment.status === 'paid'
        ? '#e0f7ec'
        : payment.status === 'pending'
        ? '#fff8e1'
        : payment.status === 'overdue'
        ? '#fdecea'
        : '#f0f0f0',
    color:
      payment.status === 'paid'
        ? '#1a7f5a'
        : payment.status === 'pending'
        ? '#b08500'
        : payment.status === 'overdue'
        ? '#b00020'
        : '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
    fontSize: '0.85rem',
    display: 'inline-block',
    minWidth: '80px',
  };

  const buttonStyleBase = {
    padding: isMobile ? '8px 12px' : '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: isMobile ? '0.85rem' : '0.92rem',
    color: '#fff',
    flex: 1,
    minWidth: '80px',
    transition: 'background-color 0.3s ease',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1100,
  };

  const modalStyle = {
    backgroundColor: '#fff',
    padding: isMobile ? '20px' : '30px',
    borderRadius: '12px',
    width: isMobile ? '90%' : '320px',
    maxWidth: '95%',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  return (
    <>
      <tr style={trStyle}>
        {isMobile ? (
          <>
            <td style={tdMobileStyle}>
              <span style={labelStyle}>Name</span>
              <span style={valueStyle}>{payment.paymentName}</span>
            </td>
            <td style={tdMobileStyle}>
              <span style={labelStyle}>Amount</span>
              <span style={valueStyle}>₹{payment.amount.toLocaleString()}</span>
            </td>
            <td style={tdMobileStyle}>
              <span style={labelStyle}>Category</span>
              <span style={valueStyle}>{payment.category}</span>
            </td>
            <td style={tdMobileStyle}>
              <span style={labelStyle}>Deadline</span>
              <span style={valueStyle}>{new Date(payment.deadline).toLocaleDateString()}</span>
            </td>
            <td style={tdMobileStyle}>
              <span style={labelStyle}>Status</span>
              <span style={statusStyle}>{payment.status}</span>
            </td>
            <td style={{ ...tdMobileStyle, flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => openModal(payment)}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: '#2196F3',
                  boxShadow: '0 4px 12px rgba(33,150,243,0.25)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1976d2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: '#f44336',
                  boxShadow: '0 4px 12px rgba(244,67,54,0.25)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d32f2f'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f44336'}
              >
                Delete
              </button>
            </td>
          </>
        ) : (
          <>
            <td style={tdStyleBase}>{payment.paymentName}</td>
            <td style={tdStyleBase}>₹{payment.amount.toLocaleString()}</td>
            <td style={tdStyleBase}>{payment.category}</td>
            <td style={tdStyleBase}>{new Date(payment.deadline).toLocaleDateString()}</td>
            <td style={tdStyleBase}>
              <span style={statusStyle}>{payment.status}</span>
            </td>
            <td style={{ ...tdStyleBase, display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => openModal(payment)}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: '#2196F3',
                  boxShadow: '0 4px 12px rgba(33,150,243,0.25)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1976d2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: '#f44336',
                  boxShadow: '0 4px 12px rgba(244,67,54,0.25)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d32f2f'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f44336'}
              >
                Delete
              </button>
            </td>
          </>
        )}
      </tr>

      {confirmDelete && (
        <div style={modalOverlayStyle} onClick={() => setConfirmDelete(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <p style={{ marginBottom: '20px', fontSize: '1.05rem', color: '#333', fontWeight: '600' }}>
              Are you sure you want to delete this payment?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={handleDelete}
                style={{ ...buttonStyleBase, backgroundColor: '#f44336', minWidth: '100px' }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ ...buttonStyleBase, backgroundColor: '#888', minWidth: '100px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentRow;
