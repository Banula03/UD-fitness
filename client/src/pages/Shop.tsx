import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Shop.css';

// Import product images
import whey from "../assets/image.jpg";
import dumbbell from "../assets/image1.jpg";
import yogaMat from "../assets/image2.jpg";
import preworkout from "../assets/image3.jpg";
import defaultImg from "../assets/image4.png";

const Shop = () => {
  const { addToCart, getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = category
        ? `http://localhost:5000/api/products?category=${category}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to assign image based on product name
  const getProductImage = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes("whey")) return whey;
    if (n.includes("dumbbell")) return dumbbell;
    if (n.includes("yoga")) return yogaMat;
    if (n.includes("pre")) return preworkout;

    return defaultImg;
  };

  return (
    <div className="shop-page">

      <nav className="shop-nav">
        <div className="container nav-container">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="logo">
            UD<span> FITNESS STUDIO</span>
          </div>

          <div className="cart-btn" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
          </div>
        </div>
      </nav>

      <div className="shop-hero">
        <div className="container">
          <h1>{category ? category.toUpperCase() : 'OUR COLLECTIONS'}</h1>

          <div className="filter-bar">
            <button
              className={category === '' ? 'active' : ''}
              onClick={() => setCategory('')}
            >
              All
            </button>

            <button
              className={category === 'equipment' ? 'active' : ''}
              onClick={() => setCategory('equipment')}
            >
              Equipment
            </button>

            <button
              className={category === 'supplements' ? 'active' : ''}
              onClick={() => setCategory('supplements')}
            >
              Supplements
            </button>
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="container">

          {loading ? (
            <div className="shop-loading">
              Elevating your experience...
            </div>
          ) : (
            <div className="product-grid">

              {products.length > 0 ? products.map((p) => (

                <div key={p._id} className="product-card">

                  <div className="product-img-wrapper">
                    <img src={getProductImage(p.name)} alt={p.name} />
                  </div>

                  <div className="product-info">
                    <span className="p-category">{p.category}</span>

                    <h3>{p.name}</h3>

                    <p className="p-price">
                      ${p.price.toFixed(2)}
                    </p>

                    <button className="add-to-cart" onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  </div>

                </div>

              )) : (

                <div className="no-products">
                  No products found in this category.
                </div>

              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Shop;