import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaShoppingCart, FaUsers, FaChartLine, FaArrowRight, FaPlay, FaCheckCircle, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || '');
    }
  }, []);

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'trainer') return '/trainer-dashboard';
    if (userRole === 'member') return '/member-dashboard';
    return '/login';
  };

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="container nav-container">
          <div className="logo">UD<span> FITNESS STUDIO</span></div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            {isLoggedIn ? (
              <Link to={getDashboardLink()} className="nav-btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-container" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hero-content">
            <h1>Complete Daily <span>workout</span> At Home</h1>
            <p>A gym is a place with a number of equipments and machines used by people to do exercises.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-teal"><FaUserPlus /> Join Now</Link>
              <Link to="/login" className="btn-watch"><FaSignInAlt /> Login</Link>
            </div>
          </div>
          <div className="hero-image-container">
             <div className="arched-image-wrapper">
                <img src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=2072&auto=format&fit=crop" alt="Gym" className="image-main" />
                <div className="floating-badge">
                   <div className="icon"><FaCheckCircle /></div>
                   <div>
                      <h4 style={{ margin: 0 }}>Expert Guidance</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Certified Trainers</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
             <div className="feature-intro">
                <h2>Why Choose Us?</h2>
                <ul className="check-list">
                   <li><FaCheckCircle className="teal-icon" /> Consultation with Expert</li>
                   <li><FaCheckCircle className="teal-icon" /> Best Workout Facilities</li>
                   <li><FaCheckCircle className="teal-icon" /> Premium Supplement Shop</li>
                </ul>
             </div>
             
             <div className="arched-feature-img">
                <div className="arch-outline">
                   <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" alt="Trainer" />
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="shop-sections">
         <div className="container">
            <div className="section-header">
               <h2>Our Professional <span>Shop</span></h2>
            </div>
            <div className="shop-grid">
               <div className="arched-card">
                  <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" alt="Equipment" />
                  <div className="card-overlay">
                     <h3>Equipment</h3>
                     <Link to="/shop?category=equipment" className="shop-now">Explore <FaArrowRight /></Link>
                  </div>
               </div>
               <div className="arched-card">
                  <img src="https://images.unsplash.com/photo-1546413411-cd9067ea7c23?q=80&w=2070&auto=format&fit=crop" alt="Supplements" />
                  <div className="card-overlay">
                     <h3>Supplements</h3>
                     <Link to="/shop?category=supplements" className="shop-now">Explore <FaArrowRight /></Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <footer className="footer-main">
         <div className="container footer-content">
            <div className="footer-logo">UD<span> FITNESS STUDIO</span></div>
            <p className="footer-tagline">Transform Your Body, Transform Your Life</p>
            <div className="footer-bottom">
               <p>&copy; {new Date().getFullYear()} UD Fitness Studio. All rights reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
