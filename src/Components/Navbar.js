import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes (when cart is updated)
    window.addEventListener("storage", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shopnow?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <style>
        {`
          .navbar {
            width: 100%;
            max-width: 100%;
            background: #121212;
            color: #f5f5f6;
            padding: 0;
            box-shadow: 0 4px 12px 0 rgba(0,0,0,0.2);
            position: sticky;
            top: 0;
            z-index: 100;
            font-family: 'Assistant', 'Segoe UI', sans-serif;
          }
          
          .navbar-container {
            max-width: 1300px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            padding: 12px 20px;
          }
          
          .navbar-logo {
            font-size: 28px;
            font-weight: 700;
            color: #ff3f6c;
            text-decoration: none;
            margin-right: 40px;
          }
          
          .navbar-menu {
            display: flex;
            gap: 20px;
            padding: 0 10px;
          }
          
          .navbar-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #f5f5f6;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
          }
          
          .navbar-menu-item::after {
            content: '';
            position: absolute;
            width: 0;
            height: 3px;
            bottom: -14px;
            left: 0;
            background-color: #ff3f6c;
            transition: width 0.3s;
          }
          
          .navbar-menu-item:hover::after,
          .navbar-menu-item.active::after {
            width: 100%;
          }
          
          .navbar-search {
            flex-grow: 1;
            max-width: 500px;
            margin: 0 20px;
          }
          
          .search-form {
            display: flex;
            align-items: center;
            background: #1f1f1f;
            border-radius: 4px;
            padding: 0 10px;
            height: 40px;
            border: 1px solid #333;
          }
          
          .search-icon {
            color: #999;
            margin-right: 10px;
          }
          
          .search-input {
            flex-grow: 1;
            background: transparent;
            border: none;
            font-size: 14px;
            outline: none;
            color: #f5f5f6;
          }
          
          .search-input::placeholder {
            color: #999;
          }
          
          .navbar-actions {
            display: flex;
            margin-left: auto;
          }
          
          .navbar-action {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 12px;
            color: #f5f5f6;
            text-decoration: none;
            font-size: 12px;
            position: relative;
          }
          
          .navbar-action-icon {
            font-size: 18px;
            margin-bottom: 3px;
          }
          
          .cart-badge {
            position: absolute;
            top: -5px;
            right: 5px;
            background: #ff3f6c;
            color: white;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 700;
          }
          
          .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            color: #f5f5f6;
            font-size: 24px;
            cursor: pointer;
          }
          
          @media (max-width: 960px) {
            .navbar-menu {
              display: none;
            }
            
            .navbar-search {
              max-width: none;
            }
            
            .mobile-menu-toggle {
              display: block;
              margin-right: 15px;
            }
            
            .mobile-menu {
              display: flex;
              flex-direction: column;
              background: #1a1a1a;
              width: 100%;
              padding: 10px 0;
              border-top: 1px solid #333;
            }
            
            .mobile-menu .navbar-menu-item {
              padding: 15px 20px;
              width: 100%;
              text-align: left;
              border-bottom: 1px solid #222;
            }
            
            .mobile-menu .navbar-menu-item::after {
              display: none;
            }
          }
          
          @media (max-width: 640px) {
            .navbar-search {
              display: none;
            }
            
            .navbar-action-text {
              display: none;
            }
          }
        `}
      </style>
      
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
        
        {/* Logo */}
        <Link to="/" className="navbar-logo">Tint</Link>
        
        {/* Main Navigation */}
        <div className="navbar-menu">
          <Link
            to="/shopnow?category=men"
            className={`navbar-menu-item${location.pathname === "/shopnow" && location.search.includes('category=men') ? " active" : ""}`}
          >
            Men
          </Link>
          <Link
            to="/shopnow?category=women"
            className={`navbar-menu-item${location.pathname === "/shopnow" && location.search.includes('category=women') ? " active" : ""}`}
          >
            Women
          </Link>
          <Link
            to="/shopnow?category=kids"
            className={`navbar-menu-item${location.pathname === "/shopnow" && location.search.includes('category=kids') ? " active" : ""}`}
          >
            Kids
          </Link>
          <Link
            to="/shopnow?category=accessories"
            className={`navbar-menu-item${location.pathname === "/shopnow" && location.search.includes('category=accessories') ? " active" : ""}`}
          >
            Accessories
          </Link>
          <Link
            to="/orders"
            className={`navbar-menu-item${location.pathname === "/orders" ? " active" : ""}`}
          >
            Orders
          </Link>
          
        </div>
        
        {/* Search Bar */}
        <div className="navbar-search">
          <form className="search-form" onSubmit={handleSearch}>
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* Action Icons */}
        <div className="navbar-actions">
          <Link to="/profile" className="navbar-action">
            <span className="navbar-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <span className="navbar-action-text">Profile</span>
          </Link>
          
          <Link to="/wishlist" className="navbar-action">
            <span className="navbar-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </span>
            <span className="navbar-action-text">Wishlist</span>
          </Link>
          
          <Link to="/cart" className="navbar-action">
            <span className="navbar-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
            <span className="navbar-action-text">Bag</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link
            to="/shopnow?category=men"
            className="navbar-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Men
          </Link>
          <Link
            to="/shopnow?category=women"
            className="navbar-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Women
          </Link>
          <Link
            to="/shopnow?category=kids"
            className="navbar-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Kids
          </Link>
          <Link
            to="/orders"
            className="navbar-menu-item"
            onClick={() => setShowMobileMenu(false)}
          >
            Orders
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
