import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    setLoading(false);
    updateTotals(savedCart);
  }, []);

  const updateTotals = (cartItems) => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.amount * (item.quantity || 1),
      0
    );
    
    const discount = cartItems.reduce((sum, item) => {
      const mrp = item.mrp || item.amount;
      return sum + ((mrp - item.amount) * (item.quantity || 1));
    }, 0);
    
    // Free shipping for orders above ₹799
    const shipping = subtotal > 799 ? 0 : 99;
    
    setTotals({
      subtotal,
      discount,
      shipping,
      total: subtotal + shipping
    });
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotals(updatedCart);
    toast.info("Item removed from cart", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQuantity
    };
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotals(updatedCart);
  };

  const handleSizeChange = (index, newSize) => {
    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      selectedSize: newSize
    };
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Size updated", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="cart-page">
      <Navbar />
      <ToastContainer />
      <style>
        {`
          /* Dark Theme Colors */
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

          body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
          }
          
          .cart-page {
            min-height: 100vh;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: 'Assistant', 'Segoe UI', sans-serif;
            padding-bottom: 60px;
          }
          
          .cart-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
          }
          
          @media (min-width: 768px) {
            .cart-container {
              flex-direction: row;
              align-items: flex-start;
              gap: 30px;
            }
          }
          
          .cart-items {
            flex-grow: 1;
            margin-bottom: 20px;
          }
          
          .cart-summary {
            width: 100%;
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 24px;
            position: sticky;
            top: 70px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
          }
          
          @media (min-width: 768px) {
            .cart-summary {
              width: 340px;
              flex-shrink: 0;
            }
          }
          
          .page-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 20px;
            color: var(--text-primary);
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            text-transform: uppercase;
            margin: 0 0 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .empty-cart {
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 20px;
            border: 1px solid var(--border-color);
          }
          
          .empty-cart-icon {
            font-size: 60px;
            margin-bottom: 20px;
            color: var(--text-secondary);
          }
          
          .empty-cart-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
          }
          
          .empty-cart-message {
            color: var(--text-secondary);
            margin-bottom: 24px;
            font-size: 16px;
          }
          
          .shop-now-btn {
            display: inline-block;
            padding: 12px 24px;
            background: var(--brand-color);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            transition: background 0.2s;
          }
          
          .shop-now-btn:hover {
            background: var(--brand-light);
          }
          
          .cart-item {
            display: flex;
            background: var(--bg-secondary);
            border-radius: 8px;
            margin-bottom: 16px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            position: relative;
            border: 1px solid var(--border-color);
          }
          
          .cart-item-img {
            width: 120px;
            height: 160px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 16px;
            background: var(--bg-element);
          }
          
          .cart-item-details {
            flex: 1;
          }
          
          .cart-item-brand {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
          }
          
          .cart-item-name {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 10px;
          }
          
          .delivery-info {
            font-size: 12px;
            margin: 12px 0;
            padding: 8px 0;
            color: var(--success-color);
            border-top: 1px dashed var(--border-color);
            border-bottom: 1px dashed var(--border-color);
          }
          
          .item-price {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .current-price {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .original-price {
            font-size: 14px;
            color: var(--text-muted);
            text-decoration: line-through;
            margin-left: 8px;
          }
          
          .discount-percent {
            font-size: 14px;
            color: var(--warning-color);
            margin-left: 8px;
          }
          
          .item-controls {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 16px;
          }
          
          .quantity-selector {
            display: flex;
            align-items: center;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-element);
          }
          
          .quantity-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 16px;
            cursor: pointer;
          }
          
          .quantity-input {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .size-selector {
            height: 32px;
            padding: 0 8px;
            border: 1px solid var(--border-color);
            background: var(--bg-element);
            color: var(--text-primary);
            border-radius: 4px;
            outline: none;
            font-size: 14px;
          }
          
          .remove-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
          }
          
          .remove-btn:hover {
            color: var(--brand-color);
          }
          
          .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          
          .price-label {
            color: var(--text-secondary);
          }
          
          .price-value {
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .discount-row .price-value {
            color: var(--success-color);
          }
          
          .shipping-row .price-value {
            color: var(--success-color);
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
            font-size: 16px;
            font-weight: 700;
          }
          
          .checkout-btn {
            width: 100%;
            padding: 14px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            text-transform: uppercase;
            transition: background 0.2s;
          }
          
          .checkout-btn:hover {
            background: var(--brand-light);
          }
          
          .checkout-btn:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
          }
          
          .savings {
            background: rgba(3, 166, 133, 0.1);
            border: 1px solid rgba(3, 166, 133, 0.2);
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .savings-icon {
            color: var(--success-color);
          }
          
          .savings-text {
            color: var(--success-color);
            font-weight: 600;
          }
          
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            width: 100%;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--brand-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .apply-coupon {
            display: flex;
            margin-bottom: 20px;
          }
          
          .coupon-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            background: var(--bg-element);
            color: var(--text-primary);
            border-radius: 4px 0 0 4px;
          }
          
          .apply-btn {
            padding: 0 12px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
          }
        `}
      </style>

      <div className="cart-container">
        <div className="cart-items">
          <h1 className="page-title">Shopping Bag</h1>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <div className="empty-cart-title">Your bag is empty</div>
              <div className="empty-cart-message">
                Looks like you haven't added anything to your bag yet.
              </div>
              <Link to="/shopnow" className="shop-now-btn">
                Shop Now
              </Link>
            </div>
          ) : (
            // Cart items
            cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img 
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `http://localhost:8000/${item.image?.replace(/^\/+/, "")}`
                  }
                  alt={item.product_name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <div className="cart-item-brand">
                    {item.brand || item.product_name?.split(' ')[0]}
                  </div>
                  <div className="cart-item-name">
                    {item.product_name}
                  </div>
                  <div className="item-price">
                    <span className="current-price">₹{item.amount}</span>
                    {item.mrp && item.mrp > item.amount && (
                      <>
                        <span className="original-price">₹{item.mrp}</span>
                        <span className="discount-percent">
                          ({Math.round(((item.mrp - item.amount) / item.mrp) * 100)}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="delivery-info">
                    Delivery by 3-4 days
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(index, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="text"
                        className="quantity-input"
                        value={item.quantity || 1}
                        readOnly
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(index, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <select 
                      className="size-selector"
                      value={item.selectedSize || "M"}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(index)}
                  aria-label="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="section-title">Price Details</div>
            
            <div className="apply-coupon">
              <input type="text" className="coupon-input" placeholder="Apply Coupon" />
              <button className="apply-btn">Apply</button>
            </div>
            
            <div className="price-details">
              <div className="price-row">
                <span className="price-label">Total MRP</span>
                <span className="price-value">₹{totals.subtotal + totals.discount}</span>
              </div>
              
              {totals.discount > 0 && (
                <div className="price-row discount-row">
                  <span className="price-label">Discount on MRP</span>
                  <span className="price-value">-₹{totals.discount}</span>
                </div>
              )}
              
              <div className="price-row">
                <span className="price-label">Convenience Fee</span>
                <span className="price-value">
                  {totals.shipping === 0 ? (
                    <span className="shipping-row">FREE</span>
                  ) : (
                    `₹${totals.shipping}`
                  )}
                </span>
              </div>
              
              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{totals.total}</span>
              </div>
            </div>
            
            {totals.discount > 0 && (
              <div className="savings">
                <span className="savings-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </span>
                <span className="savings-text">
                  You are saving ₹{totals.discount} on this order
                </span>
              </div>
            )}
            
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
