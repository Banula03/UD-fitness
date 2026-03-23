import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const CheckoutCancel = () => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', color: 'var(--text-primary)' }}>
      <FaTimesCircle style={{ fontSize: '5rem', color: '#ff4757', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Checkout Cancelled</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Your payment was cancelled and no charges were made. You can return to your cart and try again when you're ready.
      </p>
      <Link to="/cart" style={{ 
          background: '#ff4757', 
          color: '#fff', 
          padding: '15px 30px', 
          borderRadius: '12px', 
          textDecoration: 'none', 
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'inline-block'
      }}>
        Return to Cart
      </Link>
    </div>
  );
};

export default CheckoutCancel;
