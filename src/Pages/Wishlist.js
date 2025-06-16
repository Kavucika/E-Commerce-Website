import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get wishlist items from localStorage
    const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistItems(items);
    setLoading(false);
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(
      item => item.product_id !== productId
    );
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.info("Removed from wishlist", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Check if already in cart
    const exists = cart.find((item) => item.product_id === product.product_id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      
      // Trigger storage event for navbar to update cart count
      window.dispatchEvent(new Event('storage'));
    } else {
      toast.info("Product already in cart", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const viewProductDetails = (product) => {
    localStorage.setItem("viewedProduct", JSON.stringify(product));
    navigate(`/product/${product.product_id}`);
  };

  return (
    <div className="wishlist-page">
      <Navbar />
      <ToastContainer />
      
      <div className="wishlist-container">
        <h1 className="page-title">My Wishlist</h1>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Add items that you like to your wishlist. Review them anytime and easily move them to the bag.</p>
            <Link to="/shopnow" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-items-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-item" key={item.product_id}>
                <div className="item-image-container" onClick={() => viewProductDetails(item)}>
                  <img 
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `http://localhost:8000/${item.image?.replace(/^\/+/, "")}`
                    }
                    alt={item.product_name}
                    className="item-image"
                  />
                  {item.discountPercent > 0 && (
                    <div className="discount-badge">
                      {item.discountPercent}% OFF
                    </div>
                  )}
                </div>
                
                <div className="item-info">
                  <div className="item-brand">
                    {item.brand || item.product_name?.split(' ')[0]}
                  </div>
                  <div className="item-name">{item.product_name}</div>
                  
                  <div className="price-container">
                    <span className="current-price">₹{item.amount}</span>
                    {item.mrp && item.mrp > item.amount && (
                      <>
                        <span className="original-price">₹{item.mrp}</span>
                        <span className="discount-percent">
                          ({item.discountPercent}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                  
                  {item.rating && (
                    <div className="rating-container">
                      <div className="rating-badge">
                        {item.rating}
                        <svg viewBox="0 0 24 24" fill="white" width="10" height="10">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                      <span className="review-count">{item.reviews} reviews</span>
                    </div>
                  )}
                </div>
                
                <div className="item-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    MOVE TO BAG
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>
        {`
          :root {
            --bg-primary: #121212;
            --bg-secondary: #1a1a1a;
            --bg-element: #222222;
            --text-primary: #f5f5f6;
            --text-secondary: #a0a0a0;
            --text-muted: #888888;
            --border-color: #333333;
            --brand-color: #ff3f6c;
            --brand-light: #ff527b;
            --success-color: #03a685;
            --warning-color: #ff905a;
          }

          .wishlist-page {
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            font-family: 'Assistant', 'Segoe UI', sans-serif;
          }
          
          .wishlist-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .page-title {
            font-size: 24px;
            font-weight: 600;
            margin: 20px 0 30px;
          }
          
          .wishlist-items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
          
          .wishlist-item {
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
          }
          
          .wishlist-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          }
          
          .item-image-container {
            position: relative;
            cursor: pointer;
          }
          
          .item-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            display: block;
            filter: brightness(0.95);
          }
          
          .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: var(--brand-color);
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 2px;
          }
          
          .item-info {
            padding: 12px;
            flex-grow: 1;
          }
          
          .item-brand {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }
          
          .item-name {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .price-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
          }
          
          .current-price {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .original-price {
            font-size: 12px;
            color: var(--text-muted);
            text-decoration: line-through;
          }
          
          .discount-percent {
            font-size: 12px;
            color: var(--warning-color);
          }
          
          .rating-container {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .rating-badge {
            background: var(--success-color);
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            gap: 2px;
          }
          
          .review-count {
            font-size: 12px;
            color: var(--text-secondary);
          }
          
          .item-actions {
            padding: 12px;
            display: flex;
            border-top: 1px solid var(--border-color);
          }
          
          .add-to-cart-btn {
            flex-grow: 1;
            padding: 10px 12px;
            background: var(--brand-color);
            color: white;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px 0 0 4px;
            transition: background-color 0.2s;
          }
          
          .add-to-cart-btn:hover {
            background: var(--brand-light);
          }
          
          .remove-btn {
            width: 40px;
            background: var(--bg-element);
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            border-radius: 0 4px 4px 0;
            border-left: 1px solid var(--border-color);
            transition: background-color 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .remove-btn:hover {
            background-color: #333;
            color: var(--brand-color);
          }
          
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--bg-element);
            border-top: 4px solid var(--brand-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .empty-wishlist {
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
            padding: 60px 20px;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .empty-wishlist-icon {
            font-size: 50px;
            margin-bottom: 20px;
          }
          
          .empty-wishlist h2 {
            font-size: 20px;
            margin-bottom: 10px;
            color: var(--text-primary);
          }
          
          .empty-wishlist p {
            color: var(--text-secondary);
            margin-bottom: 24px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .continue-shopping-btn {
            display: inline-block;
            padding: 12px 24px;
            background: var(--brand-color);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          .continue-shopping-btn:hover {
            background: var(--brand-light);
          }
          
          @media (max-width: 768px) {
            .wishlist-items-grid {
              grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
              gap: 12px;
            }
            
            .item-image {
              height: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Wishlist;
