import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', color: 'var(--text-primary)' }}>
      <FaCheckCircle style={{ fontSize: '5rem', color: 'var(--accent-teal)', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Payment Successful!</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Thank you for your purchase. Your order has been placed and payment was successfully processed.
      </p>
      {sessionId && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
             Transaction ID: {sessionId}
          </p>
      )}
      <Link to="/shop" style={{ 
          background: 'var(--accent-teal)', 
          color: '#000', 
          padding: '15px 30px', 
          borderRadius: '12px', 
          textDecoration: 'none', 
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'inline-block'
      }}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
