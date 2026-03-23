import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import './Cart.css';

const getUserId = () => {
    const id = localStorage.getItem('userId');
    if (id) return id;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).id;
        } catch (e) {
            console.error("JWT parsing error", e);
        }
    }
    return '';
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login');
      return;
    }

    if (!address || !phone) {
      setError("Please enter delivery address and phone number");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const memberId = getUserId();
      if (!memberId) {
          setError("User identity could not be verified. Please log in again.");
          setLoading(false);
          return;
      }

      const orderData = {
        member_id: memberId,
        shipping_address: address,
        phone: phone,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      if (paymentMethod === "CARD") {
        const response = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Stripe Checkout failed");
          setLoading(false);
          return;
        }

        window.location.href = data.url;
      } else {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Checkout failed");
          setLoading(false);
          return;
        }

        clearCart();
        alert("Order placed successfully!");
        navigate(`/`);
      }

    } catch (err) {
      console.error("Checkout error:", err);
      setError("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
         <nav className="shop-nav">
          <div className="container nav-container">
            <Link to="/shop" className="back-link">
              <FaArrowLeft /> Back to Shop
            </Link>
            <div className="logo">UD<span> FITNESS STUDIO</span></div>
          </div>
        </nav>
        
        <div className="container empty-cart-container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="submit-btn btn-link">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
       <nav className="shop-nav">
        <div className="container nav-container">
          <Link to="/shop" className="back-link">
            <FaArrowLeft /> Back to Shop
          </Link>
          <div className="logo">UD<span> FITNESS STUDIO</span></div>
        </div>
      </nav>

      <div className="container cart-main-container">
        <h1>Your Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.image_url || '/placeholder.svg'} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="checkout-form">
                <h3>Shipping Information</h3>
                <div className="input-group">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Your contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="CARD">Card Payment (Coming Soon)</option>
                    <option value="BANK">Bank Transfer (Coming Soon)</option>
                  </select>
                </div>

                {error && <div style={{ color: '#ff4757', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>{error}</div>}

                <button
                  className="submit-btn checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
                
                <Link to="/shop" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
