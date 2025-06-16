import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />
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

          .home-page {
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            font-family: 'Assistant', 'Segoe UI', sans-serif;
            position: relative;
            overflow-x: hidden;
          }
          
          /* Hero Banner Section */
          .hero-banner {
            width: 100%;
            height: 400px;
            position: relative;
            margin-bottom: 40px;
            overflow: hidden;
          }
          .hero-banner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.7);
          }
          .hero-banner .overlay {
            position: absolute;
            bottom: 40px;
            left: 40px;
            max-width: 500px;
          }
          .hero-banner h1 {
            font-size: 40px;
            color: #ffffff;
            text-shadow: 0 1px 8px rgba(0,0,0,0.5);
            margin-bottom: 16px;
            font-weight: 700;
          }
          .hero-banner p {
            font-size: 20px;
            color: #ffffff;
            text-shadow: 0 1px 4px rgba(0,0,0,0.5);
            margin-bottom: 24px;
          }
          .shop-now-btn {
            background: var(--brand-color);
            color: white;
            padding: 12px 40px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            text-transform: uppercase;
            transition: background 0.3s;
          }
          .shop-now-btn:hover {
            background: var(--brand-light);
          }
          
          /* Deals Section */
          .section-title {
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            margin: 40px 0 30px;
            position: relative;
            text-transform: uppercase;
            color: var(--text-primary);
          }
          .section-title::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: var(--brand-color);
            margin: 8px auto 0;
          }
          .deals-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 20px;
          }
          .deals-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 40px;
          }
          @media (min-width: 768px) {
            .deals-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          .deal-card {
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            position: relative;
            border: 1px solid var(--border-color);
          }
          .deal-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            border-color: var(--brand-color);
          }
          .deal-card img {
            width: 100%;
            height: 240px;
            object-fit: cover;
            filter: brightness(0.9);
          }
          .deal-text {
            padding: 16px;
            text-align: center;
          }
          .deal-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--text-primary);
          }
          .deal-desc {
            font-size: 14px;
            color: var(--brand-light);
          }
          .discount-tag {
            position: absolute;
            top: 0;
            left: 0;
            background: var(--brand-color);
            color: white;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
          }
          
          /* Collections Banner Section */
          .collections-section {
            margin: 60px 0;
          }
          
          .collection-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .collection-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }
          
          @media (min-width: 768px) {
            .collection-row {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          .collection-banner {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s;
            cursor: pointer;
            border: 1px solid var(--border-color);
          }
          
          .collection-banner:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
          }
          
          .collection-banner img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            filter: brightness(0.7);
            transition: filter 0.3s, transform 0.5s;
          }
          
          .collection-banner:hover img {
            filter: brightness(0.6);
            transform: scale(1.03);
          }
          
          .collection-content {
            position: absolute;
            bottom: 30px;
            left: 30px;
            max-width: 70%;
          }
          
          .collection-title {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          
          .collection-desc {
            font-size: 16px;
            color: white;
            margin-bottom: 16px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          }
          
          .collection-btn {
            display: inline-block;
            padding: 10px 20px;
            background: var(--brand-color);
            color: white;
            font-size: 14px;
            font-weight: 600;
            border-radius: 4px;
            text-transform: uppercase;
            transition: background 0.2s;
            text-decoration: none;
          }
          
          .collection-btn:hover {
            background: var(--brand-light);
          }
          
          /* Categories Section */
          .categories-container {
            max-width: 1300px;
            margin: 0 auto 40px;
            padding: 0 20px;
          }
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          @media (min-width: 768px) {
            .categories-grid {
              grid-template-columns: repeat(6, 1fr);
            }
          }
          .category-card {
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .category-card:hover {
            transform: translateY(-5px);
          }
          .category-card img {
            width: 180px; 
            height: 250px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            border: 2px solid var(--border-color);
          }
          .category-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          /* Trending Section */
          .trending-container {
            max-width: 1300px;
            margin: 0 auto 60px;
            padding: 0 20px;
          }
          .trending-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          @media (min-width: 768px) {
            .trending-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          .trending-card {
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            position: relative;
            border: 1px solid var(--border-color);
          }
          .trending-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            border-color: var(--brand-color);
          }
          .trending-card img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            filter: brightness(0.9);
          }
          .trending-info {
            padding: 12px;
          }
          .trending-brand {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--text-primary);
          }
          .trending-name {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }
          .trending-price {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .trending-current {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
          }
          .trending-original {
            font-size: 12px;
            color: var(--text-muted);
            text-decoration: line-through;
          }
          .trending-discount {
            font-size: 12px;
            color: var(--warning-color);
            font-weight: 700;
          }
          .rating-tag {
            position: absolute;
            bottom: 80px;
            left: 0;
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            border: 1px solid var(--border-color);
          }
          .rating-tag svg {
            color: var(--success-color);
            margin-right: 4px;
          }
          
          /* Offers Strip */
          .offers-strip {
            background: #2a2a2a;
            padding: 16px 0;
            margin: 40px 0;
            text-align: center;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
          }
          .offers-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }
          .offer-item {
            display: flex;
            align-items: center;
            margin: 10px 20px;
          }
          .offer-icon {
            margin-right: 12px;
            color: var(--brand-color);
            font-size: 24px;
          }
          .offer-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          /* Newsletter */
          .newsletter {
            background: #1f1f1f;
            padding: 60px 0;
            margin-top: 40px;
            border-top: 1px solid var(--border-color);
          }
          .newsletter-container {
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
            padding: 0 20px;
          }
          .newsletter h2 {
            font-size: 24px;
            color: var(--text-primary);
            margin-bottom: 12px;
          }
          .newsletter p {
            color: var(--text-secondary);
            margin-bottom: 24px;
            font-size: 16px;
          }
          .newsletter-form {
            display: flex;
            flex-direction: column;
            max-width: 500px;
            margin: 0 auto;
          }
          @media (min-width: 768px) {
            .newsletter-form {
              flex-direction: row;
            }
          }
          .newsletter-input {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            margin-bottom: 12px;
            background-color: var(--bg-secondary);
            color: var(--text-primary);
          }
          @media (min-width: 768px) {
            .newsletter-input {
              margin-bottom: 0;
              border-radius: 4px 0 0 4px;
            }
          }
          .newsletter-btn {
            background: var(--brand-color);
            color: white;
            border: none;
            padding: 14px 24px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
          }
          @media (min-width: 768px) {
            .newsletter-btn {
              border-radius: 0 4px 4px 0;
            }
          }
          
          /* Footer */
          .footer {
            background: #1a1a1a;
            padding: 60px 0 30px;
            border-top: 1px solid var(--border-color);
          }
          .footer-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
          @media (min-width: 768px) {
            .footer-container {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          .footer-section h3 {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 24px;
            text-transform: uppercase;
          }
          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .footer-links li {
            margin-bottom: 12px;
          }
          .footer-links a {
            color: var(--text-secondary);
            font-size: 14px;
            text-decoration: none;
            transition: color 0.2s;
          }
          .footer-links a:hover {
            color: var(--brand-color);
          }
          .download-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .download-badge {
            display: block;
            max-width: 140px;
            height: auto;
          }
          .social-links {
            display: flex;
            gap: 16px;
            margin-top: 20px;
          }
          .social-links a {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--bg-element);
            transition: background 0.2s;
          }
          .social-links a:hover {
            background: var(--brand-color);
          }
          .social-links svg {
            width: 16px;
            height: 16px;
            fill: var(--text-secondary);
          }
          .social-links a:hover svg {
            fill: white;
          }
          .copyright {
            max-width: 1300px;
            margin: 40px auto 0;
            padding: 20px;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
          }
        `}
      </style>

      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Summer Collection" />
        <div className="overlay">
          <h1>Biggest Deals on Top Brands</h1>
          <p>Find your style among thousands of products</p>
          <Link to="/shopnow" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>

      {/* Deals Section */}
      <h2 className="section-title">Deals of the Day</h2>
      <div className="deals-container">
        <div className="deals-grid">
          <div className="deal-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Summer Deal" />
            <div className="deal-text">
              <h3 className="deal-title">Summer Fashion</h3>
              <p className="deal-desc">Min 50% Off</p>
            </div>
            <div className="discount-tag">TRENDING</div>
          </div>
          
          <div className="deal-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Women's Deal" />
            <div className="deal-text">
              <h3 className="deal-title">Women's Dresses</h3>
              <p className="deal-desc">30-70% Off</p>
            </div>
            <div className="discount-tag">HOT</div>
          </div>
          
          <div className="deal-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Shoes Deal" />
            <div className="deal-text">
              <h3 className="deal-title">Footwear Collection</h3>
              <p className="deal-desc">Up to 60% Off</p>
            </div>
            <div className="discount-tag">LIMITED</div>
          </div>
          
          <div className="deal-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Men's Deal" />
            <div className="deal-text">
              <h3 className="deal-title">Men's Collection</h3>
              <p className="deal-desc">40-80% Off</p>
            </div>
            <div className="discount-tag">NEW</div>
          </div>
        </div>
      </div>

      {/* Collections Banner Section */}
      <div className="collections-section">
        <div className="collection-container">
          <h2 className="section-title">Featured Collections</h2>
          
          <div className="collection-row">
            <div className="collection-banner" onClick={() => navigate("/shopnow?category=men")}>
              <img src="https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Men's Collection" />
              <div className="collection-content">
                <h3 className="collection-title">Accessories Collection</h3>
                <p className="collection-desc">Premium styling for the modern generation</p>
                <Link to="/shopnow?category=men" className="collection-btn">Explore Now</Link>
              </div>
            </div>
            
            <div className="collection-banner" onClick={() => navigate("/shopnow?category=footwear")}>
              <img src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Footwear Collection" />
              <div className="collection-content">
                <h3 className="collection-title">Footwear Collection</h3>
                <p className="collection-desc">Step out in style with our premium footwear</p>
                <Link to="/shopnow?category=footwear" className="collection-btn">Shop Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="section-title">Shop By Category</h2>
      <div className="categories-container">
        <div className="categories-grid">
          <div className="category-card" onClick={() => navigate("/shopnow?category=men")}>
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Men's Fashion" />
            <div className="category-name">Men</div>
          </div>
          
          <div className="category-card" onClick={() => navigate("/shopnow?category=women")}>
            <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1575&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Women's Fashion" />
            <div className="category-name">Women</div>
          </div>
          
          <div className="category-card" onClick={() => navigate("/shopnow?category=kids")}>
            <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Kids Fashion" />
            <div className="category-name">Kids</div>
          </div>
          
          <div className="category-card" onClick={() => navigate("/shopnow?category=accessories")}>
            <img src="https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Accessories" />
            <div className="category-name">Accessories</div>
          </div>
          
          <div className="category-card" onClick={() => navigate("/shopnow?category=footwear")}>
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Footwear" />
            <div className="category-name">Footwear</div>
          </div>
          
          <div className="category-card" onClick={() => navigate("/shopnow?category=beauty")}>
            <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Beauty" />
            <div className="category-name">Beauty</div>
          </div>
        </div>
      </div>

      {/* Offers Strip */}
      <div className="offers-strip">
        <div className="offers-container">
          <div className="offer-item">
            <div className="offer-icon">⚡</div>
            <div className="offer-text">FREE SHIPPING ON FIRST ORDER</div>
          </div>
          <div className="offer-item">
            <div className="offer-icon">🎁</div>
            <div className="offer-text">EASY 30 DAYS RETURNS</div>
          </div>
          <div className="offer-item">
            <div className="offer-icon">💰</div>
            <div className="offer-text">COD AVAILABLE</div>
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <h2 className="section-title">Trending Now</h2>
      <div className="trending-container">
        <div className="trending-grid">
          <div className="trending-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1563630423918-b58f07336ac9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Trending Product" />
            <div className="rating-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#14958f">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              4.5
            </div>
            <div className="trending-info">
              <div className="trending-brand">Roadster</div>
              <div className="trending-name">Men Regular Fit Casual Shirt</div>
              <div className="trending-price">
                <span className="trending-current">₹649</span>
                <span className="trending-original">₹1299</span>
                <span className="trending-discount">(50% OFF)</span>
              </div>
            </div>
          </div>
          
          <div className="trending-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Trending Product" />
            <div className="rating-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#14958f">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              4.2
            </div>
            <div className="trending-info">
              <div className="trending-brand">Mast & Harbour</div>
              <div className="trending-name">Men Striped Polo T-shirt</div>
              <div className="trending-price">
                <span className="trending-current">₹519</span>
                <span className="trending-original">₹1299</span>
                <span className="trending-discount">(60% OFF)</span>
              </div>
            </div>
          </div>
          
          <div className="trending-card" onClick={() => navigate("/shopnow")}>
            <img src="https://assets0.mirraw.com/images/13114200/356-1_zoom.jpeg?1740649743" alt="Trending Product" />
            <div className="rating-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#14958f">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              4.7
            </div>
            <div className="trending-info">
              <div className="trending-brand">Libas</div>
              <div className="trending-name">Women Printed Kurta with Trousers</div>
              <div className="trending-price">
                <span className="trending-current">₹1299</span>
                <span className="trending-original">₹2599</span>
                <span class="trending-discount">(50% OFF)</span>
              </div>
            </div>
          </div>
          
          <div className="trending-card" onClick={() => navigate("/shopnow")}>
            <img src="https://images.unsplash.com/photo-1607083681678-52733140f93a?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Trending Product" />
            <div className="rating-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#14958f">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              4.3
            </div>
            <div className="trending-info">
              <div className="trending-brand">Indo Era</div>
              <div className="trending-name">Women Embroidered Kurta Set</div>
              <div className="trending-price">
                <span className="trending-current">₹1559</span>
                <span className="trending-original">₹3999</span>
                <span className="trending-discount">(61% OFF)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter">
        <div className="newsletter-container">
          <h2>Subscribe to our Newsletter</h2>
          <p>Get updates on sales, new arrivals and more!</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Enter your email address" 
              required 
            />
            <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Online Shopping</h3>
            <ul className="footer-links">
              <li><a href="#men">Men</a></li>
              <li><a href="#women">Women</a></li>
              <li><a href="#kids">Kids</a></li>
              <li><a href="#home">Home & Living</a></li>
              <li><a href="#beauty">Beauty</a></li>
              <li><a href="#gift">Gift Cards</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Customer Policies</h3>
            <ul className="footer-links">
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Terms Of Use</a></li>
              <li><a href="#track">Track Orders</a></li>
              <li><a href="#shipping">Shipping</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Experience Tint App</h3>
            <div className="download-section">
              <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Google Play" className="download-badge" />
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="App Store" className="download-badge" />
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Keep in Touch</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M23.64 4.74c-.86.38-1.8.64-2.78.76 1-.6 1.76-1.54 2.12-2.67-.94.55-1.97.95-3.07 1.17a4.85 4.85 0 0 0-8.26 4.42 13.74 13.74 0 0 1-9.97-5.06 4.85 4.85 0 0 0 1.5 6.47 4.84 4.84 0 0 1-2.2-.61v.06a4.85 4.85 0 0 0 3.89 4.75 4.86 4.86 0 0 1-2.19.08 4.85 4.85 0 0 0 4.53 3.37 9.72 9.72 0 0 1-6.01 2.07c-.39 0-.78-.02-1.16-.07a13.7 13.7 0 0 0 7.41 2.17c8.9 0 13.76-7.37 13.76-13.76 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.15.63c-.78.3-1.44.71-2.1 1.37-.66.66-1.07 1.32-1.37 2.1-.3.75-.5 1.63-.56 2.9C.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.9.3.78.71 1.44 1.37 2.1.66.66 1.32 1.07 2.1 1.37.75.3 1.63.5 2.9.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.9-.56.78-.3 1.44-.71 2.1-1.37.66-.66 1.07-1.32 1.37-2.1.3-.75.5-1.63.56-2.9.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.9-.3-.78-.71-1.44-1.37-2.1-.66-.66-1.32-1.07-2.1-1.37-.75-.3-1.63-.5-2.9-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.84-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M23.5 6.2c-.14-.55-.55-1-1.07-1.15C20.8 4.8 12 4.8 12 4.8s-8.8 0-10.43.25c-.52.15-.93.6-1.07 1.15C.2 7.85.2 12 .2 12s0 4.15.3 5.8c.14.55.55 1 1.07 1.15 1.63.25 10.43.25 10.43.25s8.8 0 10.43-.25c.52-.15.93-.6 1.07-1.15.3-1.65.3-5.8.3-5.8s0-4.15-.3-5.8zM9.6 15.6V8.4l7.2 3.6-7.2 3.6z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="copyright">
          © {new Date().getFullYear()} Tint. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
