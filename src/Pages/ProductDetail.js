import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  
  useEffect(() => {
    // First check if we have the product in localStorage
    const viewedProduct = localStorage.getItem("viewedProduct");
    if (viewedProduct) {
      const parsedProduct = JSON.parse(viewedProduct);
      // Only use if IDs match
      if (parsedProduct.product_id.toString() === id) {
        setProduct(parsedProduct);
        setLoading(false);
        checkWishlist(parsedProduct.product_id);
        return;
      }
    }
    
    // Otherwise fetch from API
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Product not found`);
        }
        return res.json();
      })
      .then((data) => {
        // Add additional fields if needed
        const mrp = data.mrp || (data.amount * 1.4);
        const discountPercent = mrp > data.amount 
          ? Math.round(((mrp - data.amount) / mrp) * 100) 
          : 0;
        const rating = data.rating || (Math.random() * 2 + 3).toFixed(1);
        const reviews = data.reviews || Math.floor(Math.random() * 100);
        const enhancedProduct = { 
          ...data, 
          mrp, 
          discountPercent, 
          rating, 
          reviews 
        };
        
        setProduct(enhancedProduct);
        checkWishlist(enhancedProduct.product_id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  
  // Check if product is in wishlist
  const checkWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setInWishlist(wishlist.some(item => item.product_id === productId));
  };
  
  // Add to Cart handler
  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Check if already in cart
    const exists = cart.find((item) => item.product_id === product.product_id);
    
    if (!exists) {
      // Add product with selected size and quantity
      const productToAdd = {
        ...product,
        selectedSize: selectedSize || "M",
        quantity: quantity
      };
      cart.push(productToAdd);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      // Update quantity if already in cart
      exists.quantity = (exists.quantity || 1) + quantity;
      if (selectedSize) exists.selectedSize = selectedSize;
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.info("Updated quantity in cart!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };
  
  // Buy Now handler
  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };
  
  // Toggle wishlist
  const toggleWishlist = () => {
    if (!product) return;
    
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existingIndex = wishlist.findIndex((item) => item.product_id === product.product_id);
    
    if (existingIndex === -1) {
      wishlist.push(product);
      setInWishlist(true);
      toast.success("Added to wishlist!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      wishlist.splice(existingIndex, 1);
      setInWishlist(false);
      toast.info("Removed from wishlist!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };
  
  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
        <style>
          {`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff3f6c;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>{error || "This product doesn't exist or has been removed."}</p>
          <button onClick={() => window.location.href = "/shop"}>
            Continue Shopping
          </button>
        </div>
        <style>
          {`
          .error-container {
            text-align: center;
            padding: 60px 20px;
          }
          .error-container h2 {
            color: #282c3f;
            margin-bottom: 16px;
          }
          .error-container p {
            color: #94969f;
            margin-bottom: 24px;
          }
          .error-container button {
            background: #ff3f6c;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }
          `}
        </style>
      </div>
    );
  }
  
  // Generate sample sizes if not available
  const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];
  
  // Generate multiple images for gallery if only one exists
  const images = product.gallery 
    ? product.gallery 
    : Array(4).fill(product.image);
  
  return (
    <div className="product-detail-page">
      <Navbar />
      <ToastContainer />
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
          
          .product-detail-page {
            font-family: 'Assistant', 'Segoe UI', Helvetica, Arial, sans-serif;
            background: var(--bg-primary);
            min-height: 100vh;
            color: var(--text-primary);
          }
          
          .product-detail-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .breadcrumb {
            margin-bottom: 20px;
            color: var(--text-secondary);
            font-size: 14px;
          }
          
          .breadcrumb a {
            color: var(--text-secondary);
            text-decoration: none;
          }
          
          .breadcrumb a:hover {
            color: var(--brand-color);
          }
          
          .breadcrumb span {
            margin: 0 4px;
          }
          
          .product-detail-content {
            display: flex;
            gap: 40px;
          }
          
          .product-gallery {
            flex: 1;
            display: flex;
            gap: 20px;
          }
          
          .product-thumbs {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .product-thumb {
            width: 70px;
            height: 70px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            border: 1px solid var(--border-color);
          }
          
          .product-thumb.active {
            opacity: 1;
            border: 1px solid var(--brand-color);
          }
          
          .product-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.95);
          }
          
          .product-main-image {
            flex: 1;
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border-color);
          }
          
          .product-main-image img {
            width: 100%;
            height: auto;
            max-height: 600px;
            object-fit: contain;
            filter: brightness(0.95);
          }
          
          .product-info {
            flex: 1;
            padding: 0 20px;
          }
          
          .product-brand {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }
          
          .product-name {
            font-size: 20px;
            font-weight: 400;
            color: var(--text-secondary);
            margin-top: 0;
            margin-bottom: 16px;
          }
          
          .rating-container {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
          
          .rating-badge svg {
            width: 10px;
            height: 10px;
          }
          
          .review-count {
            font-size: 14px;
            color: var(--text-secondary);
            margin-left: 8px;
          }
          
          .price-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 4px;
          }
          
          .product-price {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .product-mrp {
            font-size: 20px;
            color: var(--text-muted);
            text-decoration: line-through;
          }
          
          .product-discount {
            font-size: 20px;
            color: var(--warning-color);
            font-weight: 700;
          }
          
          .tax-info {
            color: var(--success-color);
            font-size: 14px;
            margin-bottom: 20px;
          }
          
          .size-section {
            margin-bottom: 20px;
          }
          
          .size-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .size-header h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
          }
          
          .size-chart-btn {
            background: none;
            border: none;
            font-size: 14px;
            font-weight: 700;
            color: var(--brand-color);
            cursor: pointer;
            text-decoration: underline;
          }
          
          .size-options {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .size-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            background: var(--bg-secondary);
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .size-btn.selected {
            border: 1px solid var(--brand-color);
            color: var(--brand-color);
          }
          
          .quantity-section {
            margin-bottom: 20px;
          }
          
          .quantity-section h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 8px;
          }
          
          .quantity-selector {
            display: flex;
            align-items: center;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            width: fit-content;
            background: var(--bg-secondary);
          }
          
          .quantity-selector button {
            width: 40px;
            height: 40px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-primary);
          }
          
          .quantity-selector span {
            width: 40px;
            text-align: center;
            font-size: 16px;
            color: var(--text-primary);
          }
          
          .product-actions {
            display: flex;
            gap: 16px;
            margin-bottom: 30px;
          }
          
          .cart-btn, .wishlist-btn {
            flex: 1;
            height: 50px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .cart-btn {
            background: var(--brand-color);
            color: white;
            border: none;
          }
          
          .cart-btn:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
          }
          
          .wishlist-btn {
            background: var(--bg-secondary);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
          }
          
          .wishlist-btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
          }
          
          .wishlist-btn.active {
            color: var(--brand-color);
          }
          
          .wishlist-btn.active svg {
            fill: var(--brand-color);
            stroke: var(--brand-color);
          }
          
          .delivery-section {
            padding: 20px 0;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
          }
          
          .delivery-section h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 12px;
          }
          
          .pincode-check {
            display: flex;
            margin-bottom: 16px;
          }
          
          .pincode-check input {
            flex: 1;
            height: 40px;
            border: 1px solid var(--border-color);
            border-radius: 4px 0 0 4px;
            padding: 0 12px;
            font-size: 14px;
            background: var(--bg-secondary);
            color: var(--text-primary);
          }
          
          .pincode-check button {
            width: 80px;
            height: 40px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }
          
          .delivery-info {
            padding-left: 20px;
            margin-top: 10px;
          }
          
          .delivery-info li {
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--text-secondary);
          }
          
          .product-description {
            margin-top: 30px;
          }
          
          .product-description h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 12px;
          }
          
          .product-description p {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.5;
          }
          
          .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: var(--brand-color);
            color: white;
            font-size: 14px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 2px;
          }
          
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--bg-element);
            border-top: 3px solid var(--brand-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .error-container {
            text-align: center;
            padding: 60px 20px;
          }
          
          .error-container h2 {
            color: var(--text-primary);
            margin-bottom: 16px;
          }
          
          .error-container p {
            color: var(--text-secondary);
            margin-bottom: 24px;
          }
          
          .error-container button {
            background: var(--brand-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }
          
          @media (max-width: 768px) {
            .product-detail-content {
              flex-direction: column;
            }
            
            .product-gallery {
              flex-direction: column-reverse;
            }
            
            .product-thumbs {
              flex-direction: row;
              overflow-x: auto;
            }
          }
        `}
      </style>
      
      <div className="product-detail-container">
        <div className="breadcrumb">
          <a href="/">Home</a> <span>/</span> 
          <a href="/shopnow">Clothing</a> <span>/</span> 
          <span>{product.product_name}</span>
        </div>
        
        <div className="product-detail-content">
          <div className="product-gallery">
            <div className="product-thumbs">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`product-thumb ${activeImage === index ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={
                      img.startsWith("http")
                        ? img
                        : `http://localhost:8000/${img.replace(/^\/+/, "")}`
                    }
                    alt={`${product.product_name} view ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="product-main-image">
              <img 
                src={
                  images[activeImage].startsWith("http")
                    ? images[activeImage]
                    : `http://localhost:8000/${images[activeImage].replace(/^\/+/, "")}`
                }
                alt={product.product_name}
              />
              {product.discountPercent > 0 && (
                <div className="discount-badge">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>
          </div>
          
          <div className="product-info">
            <div className="product-brand">
              {product.brand || product.product_name.split(' ')[0]}
            </div>
            <h1 className="product-name">{product.product_name}</h1>
            
            {product.rating && (
              <div className="rating-container">
                <div className="rating-badge">
                  {product.rating}
                  <svg viewBox="0 0 24 24" fill="white">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div className="review-count">{product.reviews} reviews</div>
              </div>
            )}
            
            <div className="price-container">
              <div className="product-price">₹{product.amount}</div>
              {product.mrp && product.mrp > product.amount && (
                <div className="product-mrp">₹{product.mrp}</div>
              )}
              {product.discountPercent > 0 && (
                <div className="product-discount">({product.discountPercent}% OFF)</div>
              )}
            </div>
            
            <div className="tax-info">inclusive of all taxes</div>
            
            <div className="size-section">
              <div className="size-header">
                <h3>SELECT SIZE</h3>
                <button className="size-chart-btn">SIZE CHART</button>
              </div>
              <div className="size-options">
                {sizes.map((size) => (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quantity-section">
              <h3>QUANTITY</h3>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                className="cart-btn" 
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                ADD TO BAG
              </button>
              <button 
                className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {inWishlist ? 'WISHLISTED' : 'WISHLIST'}
              </button>
            </div>
            
            <div className="delivery-section">
              <h3>DELIVERY OPTIONS</h3>
              <div className="pincode-check">
                <input type="text" placeholder="Enter pincode" />
                <button>CHECK</button>
              </div>
              <ul className="delivery-info">
                <li>Free delivery on orders above ₹799</li>
                <li>Easy 14 days return & exchange</li>
              </ul>
            </div>
            
            {product.description && (
              <div className="product-description">
                <h3>PRODUCT DETAILS</h3>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>
        {`
        .product-detail-page {
          font-family: 'Assistant', 'Segoe UI', Helvetica, Arial, sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #282c3f;
        }
        
        .product-detail-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .breadcrumb {
          margin-bottom: 20px;
          color: #94969f;
          font-size: 14px;
        }
        
        .breadcrumb a {
          color: #94969f;
          text-decoration: none;
        }
        
        .breadcrumb span {
          margin: 0 4px;
        }
        
        .product-detail-content {
          display: flex;
          gap: 40px;
        }
        
        .product-gallery {
          flex: 1;
          display: flex;
          gap: 20px;
        }
        
        .product-thumbs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .product-thumb {
          width: 70px;
          height: 70px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
          border: 1px solid #eaeaec;
        }
        
        .product-thumb.active {
          opacity: 1;
          border: 1px solid #ff3f6c;
        }
        
        .product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-main-image {
          flex: 1;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .product-main-image img {
          width: 100%;
          height: auto;
          max-height: 600px;
          object-fit: contain;
        }
        
        .product-info {
          flex: 1;
          padding: 0 20px;
        }
        
        .product-brand {
          font-size: 24px;
          font-weight: 700;
          color: #282c3f;
          margin-bottom: 4px;
        }
        
        .product-name {
          font-size: 20px;
          font-weight: 400;
          color: #535766;
          margin-top: 0;
          margin-bottom: 16px;
        }
        
        .rating-container {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .rating-badge {
          background: #14958f;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .rating-badge svg {
          width: 10px;
          height: 10px;
        }
        
        .review-count {
          font-size: 14px;
          color: #535766;
          margin-left: 8px;
        }
        
        .price-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }
        
        .product-price {
          font-size: 24px;
          font-weight: 700;
          color: #282c3f;
        }
        
        .product-mrp {
          font-size: 20px;
          color: #94969f;
          text-decoration: line-through;
        }
        
        .product-discount {
          font-size: 20px;
          color: #ff905a;
          font-weight: 700;
        }
        
        .tax-info {
          color: #03a685;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .size-section {
          margin-bottom: 20px;
        }
        
        .size-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .size-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: #282c3f;
          margin: 0;
        }
        
        .size-chart-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 700;
          color: #ff3f6c;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .size-options {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .size-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #d4d5d9;
          background: white;
          font-size: 14px;
          font-weight: 700;
          color: #282c3f;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .size-btn.selected {
          border: 1px solid #ff3f6c;
          color: #ff3f6c;
        }
        
        .quantity-section {
          margin-bottom: 20px;
        }
        
        .quantity-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #282c3f;
          margin: 0 0 8px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid #d4d5d9;
          border-radius: 4px;
          width: fit-content;
        }
        
        .quantity-selector button {
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #282c3f;
        }
        
        .quantity-selector span {
          width: 40px;
          text-align: center;
          font-size: 16px;
        }
        
        .product-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
        }
        
        .cart-btn, .wishlist-btn {
          flex: 1;
          height: 50px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .cart-btn {
          background: #ff3f6c;
          color: white;
          border: none;
        }
        
        .cart-btn:disabled {
          background: #d4d5d9;
          cursor: not-allowed;
        }
        
        .wishlist-btn {
          background: white;
          color: #282c3f;
          border: 1px solid #d4d5d9;
        }
        
        .wishlist-btn svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        
        .wishlist-btn.active {
          color: #ff3f6c;
        }
        
        .wishlist-btn.active svg {
          fill: #ff3f6c;
          stroke: #ff3f6c;
        }
        
        .delivery-section {
          padding: 20px 0;
          border-top: 1px solid #eaeaec;
          border-bottom: 1px solid #eaeaec;
          margin-bottom: 20px;
        }
        
        .delivery-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #282c3f;
          margin: 0 0 12px;
        }
        
        .pincode-check {
          display: flex;
          margin-bottom: 16px;
        }
        
        .pincode-check input {
          flex: 1;
          height: 40px;
          border: 1px solid #d4d5d9;
          border-radius: 4px 0 0 4px;
          padding: 0 12px;
          font-size: 14px;
        }
        
        .pincode-check button {
          width: 80px;
          height: 40px;
          background: #ff3f6c;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .delivery-info {
          padding-left: 20px;
          margin-top: 10px;
        }
        
        .delivery-info li {
          margin-bottom: 8px;
          font-size: 14px;
          color: #535766;
        }
        
        .product-description {
          margin-top: 30px;
        }
        
        .product-description h3 {
          font-size: 16px;
          font-weight: 700;
          color: #282c3f;
          margin: 0 0 12px;
        }
        
        .product-description p {
          font-size: 14px;
          color: #535766;
          line-height: 1.5;
        }
        
        .discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ff3f6c;
          color: white;
          font-size: 14px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 2px;
        }
        
        @media (max-width: 768px) {
          .product-detail-content {
            flex-direction: column;
          }
          
          .product-gallery {
            flex-direction: column-reverse;
          }
          
          .product-thumbs {
            flex-direction: row;
            overflow-x: auto;
          }
        }
        `}
      </style>
    </div>
  );
};

export default ProductDetail;
