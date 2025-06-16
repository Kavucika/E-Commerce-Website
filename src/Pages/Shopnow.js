import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShopNow = () => {
  const location = useLocation();
  // Parse query parameters to get category from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  const [minDiscount, setMinDiscount] = useState(""); 
  const [sortBy, setSortBy] = useState("recommended");
  const [categoryFilters, setCategoryFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("grid"); // grid or list
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch products and initialize states
  useEffect(() => {
    setLoading(true);
    
    // Get wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistItems(storedWishlist.map(item => item.product_id));

    fetch("http://localhost:8000/api/products/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Calculate and add discount percentage to each product
        const productsWithDiscount = data.map((product) => {
          console.log("MRP Debug:", product.product_name, product.mrp); 
          const price = Number(product.amount);
          const mrp = product.mrp && Number(product.mrp) > price ? Number(product.mrp) : null;

          const discountPercent = mrp
            ? Math.round(((mrp - price) / mrp) * 100)
            : 0;

          console.log(`✅ ${product.product_name}: price = ${price}, mrp = ${mrp}, discount = ${discountPercent}%`);


        const rating = product.rating || (Math.random() * 2 + 3).toFixed(1);
        const reviews = product.reviews || Math.floor(Math.random() * 100);

        const category = (product.category || 'Uncategorized').toLowerCase();
        const gender = (product.gender || '').toLowerCase();

        if (!categories.includes(category) && category !== 'uncategorized') {
          setCategories(prev => [...prev, category]);
        }

  return {
    ...product,
    discountPercent,
    rating,
    reviews,
    mrp,
    category,
    gender,
  };
});
        setProducts(productsWithDiscount);
        setFilteredProducts(productsWithDiscount);
        const uniqueCategories = [...new Set(productsWithDiscount.map(p => p.category))];
        setCategories(uniqueCategories);

        setLoading(false);
        
        // If we have a category from URL, set the appropriate gender filter
        if (categoryFromUrl) {
          if (categoryFromUrl === 'men') setGender('male');
          else if (categoryFromUrl === 'women') setGender('female');
          else if (categoryFromUrl === 'boys' || categoryFromUrl === 'kids') setGender('boys');
          else if (categoryFromUrl === 'girls') setGender('girls');
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  // Handle URL parameter changes for category
  useEffect(() => {
    // Update category filters when URL changes
    if (categoryFromUrl) {
      const newFilters = {
        men: categoryFromUrl === 'men',
        women: categoryFromUrl === 'women',
        kids: categoryFromUrl === 'kids'
      };
      
      setCategoryFilters(newFilters);
      //setSelectedCategories([categoryFromUrl?.toLowerCase().trim()]);
      // Also set the gender filter to match selected category
      if (categoryFromUrl === 'men') setGender('male');
      else if (categoryFromUrl === 'women') setGender('female');
      else if (categoryFromUrl === 'kids') setGender('kids');
    }
  }, [location.search, categoryFromUrl]);

  // Handle category filter changes
  const handleCategoryChange = (category) => {
    // Create new filter state
    const newFilters = {
      ...categoryFilters,
      [category]: !categoryFilters[category]
    };
    
    setCategoryFilters(newFilters);
    
    // Update gender filter when category is changed
    if (category === 'men' && newFilters.men) setGender('male');
    else if (category === 'women' && newFilters.women) setGender('female');
    else if (category === 'kids' && newFilters.kids) setGender('kids');
    else if (!newFilters.men && !newFilters.women && !newFilters.kids) {
      // If no categories are selected, reset gender filter
      setGender('');
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setGender("");
    setMinDiscount("");
    setSortBy("recommended");
    setCategoryFilters({
      men: false,
      women: false,
      kids: false
    });
    setSelectedCategories([]);
    setSearchQuery("");
  };
  
  // Search products
  const handleSearch = (e) => {
    e.preventDefault();
    // Search already handled in the useEffect filter function
    toast.info(`Searching for "${searchQuery}"`);
  };

  // Filter products based on all criteria
  useEffect(() => {
    let filtered = products;
    
    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.product_name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }
    
    // Apply product category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
  

    // Apply price filters
    if (minPrice !== "") {
      filtered = filtered.filter((p) => Number(p.amount) >= Number(minPrice));
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((p) => Number(p.amount) <= Number(maxPrice));
    }
    
    // Apply gender filter (dropdown)
    if (gender !== "") {
      filtered = filtered.filter((p) => {
        const actualGender = p.gender?.toLowerCase();

        if (gender === "male") return actualGender === "m";
        if (gender === "female") return actualGender === "f";
        if (gender === "kids") return ["k", "boys", "girls"].includes(actualGender);
        if (gender === "unisex") return actualGender === "u";

        return true;
      });
    }

    
    // Apply discount filter
    if (minDiscount !== "") {
      filtered = filtered.filter(
        (p) => (p.discountPercent || 0) >= Number(minDiscount)
      );
    }
    
    // Apply sorting
    if (sortBy === "discount") {
      filtered = [...filtered].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === "priceLow") {
      filtered = [...filtered].sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "priceHigh") {
      filtered = [...filtered].sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      // Assuming newer products have higher IDs
      filtered = [...filtered].sort((a, b) => b.product_id - a.product_id);
    }
    
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, gender, minDiscount, sortBy, categoryFilters, selectedCategories, products, searchQuery]);

  // Add to Cart handler
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Check if already in cart (by product_id)
    const exists = cart.find((item) => item.product_id === product.product_id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      toast.info("Product already in cart.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  // Buy Now handler
  const handleBuyNow = (product) => {
    handleAddToCart(product);
    window.location.href = "/cart";
  };

  // Add to Wishlist handler with toggle functionality
  const handleAddToWishlist = (product, e) => {
    if (e) e.stopPropagation();
    
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existingIndex = wishlist.findIndex((item) => item.product_id === product.product_id);
    
    if (existingIndex === -1) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistItems(prev => [...prev, product.product_id]);
      toast.success("Added to wishlist!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setWishlistItems(prev => prev.filter(id => id !== product.product_id));
      toast.info("Removed from wishlist.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // View product details - Updated to properly navigate to product detail page
  const viewProductDetails = (product) => {
    // Store the product in localStorage for easy access on the details page
    localStorage.setItem("viewedProduct", JSON.stringify(product));
    // Navigate to product detail page
    window.location.href = `/product/${product.product_id}`;
  };

  // Handle quick view
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const handleQuickView = (product, e) => {
    if (e) e.stopPropagation();
    setQuickViewProduct(product);
  };
  
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Handle product category selection
  const handleProductCategoryChange = (category) => {
  setSelectedCategories(prev => {
    if (prev.includes(category)) {
      return prev.filter(c => c !== category);
    } else {
      return [...prev, category];
    }
  });
};



  // Loading state
  if (loading) {
    return (
      <div className="shop-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
        <style>{`
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
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="shop-page">
        <Navbar />
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
        <style>{`
          .error-container {
            text-align: center;
            padding: 50px 20px;
          }
          .error-container button {
            background: #ff3f6c;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="shop-page">
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

          .shop-page {
            padding: 40px 20px;
            font-family: 'Assistant', 'Segoe UI', Helvetica, Arial, sans-serif;
            background: var(--bg-primary);
            min-height: 100vh;
            color: var(--text-primary);
          }
          
          .shop-container {
            display: flex;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .filters-column {
            width: 240px;
            padding-right: 24px;
            flex-shrink: 0;
          }
          
          .products-column {
            flex-grow: 1;
          }
          
          .breadcrumb {
            margin-bottom: 16px;
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
          
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 16px;
          }
          
          .category-title {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }
          
          .item-count {
            color: var(--text-secondary);
            font-size: 14px;
            margin-left: 8px;
            font-weight: normal;
          }
          
          .sort-dropdown {
            position: relative;
          }
          
          .sort-dropdown select {
            appearance: none;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 8px 32px 8px 12px;
            font-size: 14px;
            color: var(--text-primary);
            cursor: pointer;
            min-width: 200px;
          }
          
          .sort-dropdown select:focus {
            outline: none;
            border-color: var(--brand-color);
          }
          
          .filters-section {
            margin-bottom: 20px;
          }
          
          .filter-heading {
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-primary);
            margin: 16px 0 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .filter-heading::after {
            content: '';
            width: 10px;
            height: 10px;
            border-right: 1.5px solid var(--text-primary);
            border-bottom: 1.5px solid var(--text-primary);
            transform: rotate(45deg);
          }
          
          .category-filter {
            margin-bottom: 10px;
          }
          
          .filter-checkbox {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--text-primary);
            cursor: pointer;
          }
          
          .filter-checkbox input {
            margin-right: 8px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: var(--brand-color);
          }
          
          .price-filters input,
          .price-filters select {
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
            color: var(--text-primary);
            background-color: var(--bg-secondary);
          }
          
          .price-filters input:focus,
          .price-filters select:focus {
            outline: none;
            border-color: var(--brand-color);
          }
          
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
            gap: 16px;
          }
          
          .product-card {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-secondary);
            transition: box-shadow 0.3s;
            cursor: pointer;
            border: 1px solid var(--border-color);
          }
          
          .product-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            border-color: var(--brand-color);
          }
          
          .product-card .wishlist-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--bg-element);
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            color: var(--text-primary);
          }
          
          .product-card:hover .wishlist-btn {
            opacity: 1;
          }
          
          .product-card .wishlist-btn svg {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: var(--text-primary);
            stroke-width: 2;
          }
          
          .product-card .wishlist-btn.active svg {
            fill: var(--brand-color);
            stroke: var(--brand-color);
          }
          
          .product-card img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            display: block;
            filter: brightness(0.95);
          }
          
          .product-info {
            padding: 8px 12px 16px;
          }
          
          .product-brand {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .product-name {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .price-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .product-price {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .product-mrp {
            font-size: 12px;
            color: var(--text-muted);
            text-decoration: line-through;
          }
          
          .discount-badge {
            position: absolute;
            left: 10px;
            top: 10px;
            background: var(--brand-color);
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 2px;
          }
          
          .product-discount {
            font-size: 12px;
            color: var(--warning-color);
            font-weight: 700;
          }
          
          .rating-container {
            display: flex;
            align-items: center;
            margin-top: 8px;
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
            font-size: 12px;
            color: var(--text-secondary);
            margin-left: 6px;
          }

          /* Additional Styles */
          .search-container {
            margin-bottom: 20px;
          }
          
          .search-form {
            display: flex;
            max-width: 100%;
            margin-bottom: 16px;
          }
          
          .search-form input {
            flex-grow: 1;
            padding: 10px 16px;
            border: 1px solid var(--border-color);
            border-right: none;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
            background-color: var(--bg-secondary);
            color: var(--text-primary);
          }
          
          .search-form button {
            padding: 0 16px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
          }
          
          .filter-clear-btn {
            background: transparent;
            border: none;
            color: var(--brand-color);
            font-size: 12px;
            cursor: pointer;
            margin-left: auto;
          }
          
          .view-toggle {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          
          .view-btn {
            padding: 4px 8px;
            background: transparent;
            border: 1px solid var(--border-color);
            cursor: pointer;
            color: var(--text-primary);
          }
          
          .view-btn.active {
            background: var(--bg-element);
          }
          
          .view-btn:first-child {
            border-radius: 4px 0 0 4px;
          }
          
          .view-btn:last-child {
            border-radius: 0 4px 4px 0;
          }
          
          .products-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .product-list-item {
            display: flex;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
          }
          
          .product-list-image {
            width: 180px;
            height: 240px;
            object-fit: cover;
            filter: brightness(0.95);
          }
          
          .product-list-details {
            padding: 16px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }
          
          .quick-view-btn {
            display: none;
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-element);
            border: 1px solid var(--border-color);
            padding: 8px 16px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            color: var(--text-primary);
          }
          
          .product-card:hover .quick-view-btn {
            display: block;
          }

          /* Quick view modal */
          .quick-view-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .quick-view-modal {
            width: 90%;
            max-width: 900px;
            background: var(--bg-primary);
            border-radius: 8px;
            display: flex;
            max-height: 90vh;
            overflow: hidden;
            border: 1px solid var(--border-color);
          }
          
          .modal-left {
            width: 50%;
            padding: 20px;
          }
          
          .modal-left img {
            width: 100%;
            height: auto;
            object-fit: contain;
            filter: brightness(0.95);
          }
          
          .modal-right {
            width: 50%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }
          
          .modal-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--bg-element);
            border: 1px solid var(--border-color);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            color: var(--text-primary);
          }
          
          .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: auto;
          }
          
          .modal-cart-btn, .modal-buy-btn {
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            flex: 1;
          }
          
          .modal-cart-btn {
            background: var(--bg-element);
            border: 1px solid var(--brand-color);
            color: var(--brand-color);
          }
          
          .modal-buy-btn {
            background: var(--brand-color);
            color: white;
          }
          
          .category-pill {
            display: inline-block;
            padding: 4px 12px;
            background: var(--bg-element);
            border-radius: 20px;
            margin-right: 8px;
            margin-bottom: 8px;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
          }
          
          .category-pill.active {
            background: rgba(255, 63, 108, 0.1);
            color: var(--brand-color);
            border-color: var(--brand-color);
          }
          
          .product-count {
            color: var(--text-secondary);
            font-size: 14px;
            text-align: right;
            margin-top: 8px;
          }
          
          .no-products {
            text-align: center;
            padding: 60px 20px;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }
          
          .no-products h3 {
            margin-bottom: 16px;
            color: var(--text-primary);
          }
          
          .no-products p {
            color: var(--text-secondary);
            margin-bottom: 24px;
          }
          
          .reset-btn {
            background: var(--brand-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
          }
          
          /* Loading and error states */
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
            padding: 50px 20px;
          }
          
          .error-container button {
            background: var(--brand-color);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
            cursor: pointer;
          }
        `}
      </style>

      <div className="shop-container">
        {/* Left Column - Filters */}
        <div className="filters-column">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search for products" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          <div className="filters-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>FILTERS</h3>
              <button className="filter-clear-btn" onClick={resetFilters}>CLEAR ALL</button>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="filters-section">
              <h3 className="filter-heading">PRODUCT CATEGORY</h3>
              <div>
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className={`category-pill ${selectedCategories.includes(category) ? 'active' : ''}`}
                    onClick={() => handleProductCategoryChange(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="filters-section">
            <h3 className="filter-heading">PRICE RANGE</h3>
            <div className="price-filters">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₹ Min"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₹ Max"
              />
            </div>
          </div>

          <div className="filters-section">
            <h3 className="filter-heading">DISCOUNT</h3>
            <div className="price-filters">
              <select
                value={minDiscount}
                onChange={(e) => setMinDiscount(e.target.value)}
              >
                <option value="">All</option>
                <option value="10">10% & Above</option>
                <option value="20">20% & Above</option>
                <option value="30">30% & Above</option>
                <option value="40">40% & Above</option>
                <option value="50">50% & Above</option>
                <option value="60">60% & Above</option>
                <option value="70">70% & Above</option>
              </select>
            </div>
          </div>
          
          <div className="filters-section">
            <h3 className="filter-heading">GENDER</h3>
            <div className="price-filters">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="kids">Kids</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Right Column - Products */}
        <div className="products-column">
          <div className="breadcrumb">
            <a href="/">Home</a> <span>/</span> 
            {categoryFromUrl ? (
              <>
                <span>{categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)}</span>
              </>
            ) : (
              <span>All Products</span>
            )}
          </div>
          
          <div className="header-section">
            <h1 className="category-title">
              {categoryFromUrl ? (
                categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)
              ) : (
                "All Products"
              )} 
              <span className="item-count">({filteredProducts.length} items)</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewType === 'grid' ? 'active' : ''}`} 
                  onClick={() => setViewType('grid')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={`view-btn ${viewType === 'list' ? 'active' : ''}`} 
                  onClick={() => setViewType('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="sort-dropdown">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="newest">What's New</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Better Discount</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products found!</h3>
              <p>Try changing your filter criteria or search term.</p>
              <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : viewType === 'grid' ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div className="product-card" key={product.product_id} onClick={() => viewProductDetails(product)}>
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:8000/${product.image.replace(/^\/+/, "")}`
                    }
                    alt={product.product_name}
                  />
                  <button 
                    className={`wishlist-btn ${isInWishlist(product.product_id) ? 'active' : ''}`}
                    onClick={(e) => handleAddToWishlist(product, e)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  {product.discountPercent > 0 && (
                    <div className="discount-badge">
                      {product.discountPercent}% OFF
                    </div>
                  )}
                  <button 
                    className="quick-view-btn"
                    onClick={(e) => handleQuickView(product, e)}
                  >
                    Quick View
                  </button>
                  <div className="product-info">
                    <div className="product-brand">
                      {product.brand || product.product_name.split(' ')[0]}
                    </div>
                    <div className="product-name">
                      {product.product_name}
                    </div>
                    <div className="price-container">
                      <div className="product-price">₹{product.amount}</div>
                      {product.mrp && product.mrp > product.amount && (
                        <div className="product-mrp">₹{product.mrp}</div>
                      )}
                      {product.discountPercent > 0 && (
                        <div className="product-discount">({product.discountPercent}% OFF)</div>
                      )}
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-list">
              {filteredProducts.map((product) => (
                <div className="product-list-item" key={product.product_id} onClick={() => viewProductDetails(product)}>
                  <img
                    className="product-list-image"
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:8000/${product.image.replace(/^\/+/, "")}`
                    }
                    alt={product.product_name}
                  />
                  <div className="product-list-details">
                    <div className="product-brand">
                      {product.brand || product.product_name.split(' ')[0]}
                    </div>
                    <div className="product-name">
                      {product.product_name}
                    </div>
                    <div className="price-container">
                      <div className="product-price">₹{product.amount}</div>
                      {product.mrp && product.mrp > product.amount && (
                        <div className="product-mrp">₹{product.mrp}</div>
                      )}
                      {product.discountPercent > 0 && (
                        <div className="product-discount">({product.discountPercent}% OFF)</div>
                      )}
                    </div>
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
                    <div style={{marginTop: 'auto', display: 'flex', gap: '10px'}}>
                      <button 
                        className="cart-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className={`wishlist-btn ${isInWishlist(product.product_id) ? 'active' : ''}`}
                        onClick={(e) => handleAddToWishlist(product, e)}
                        style={{position: 'relative', opacity: 1}}
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Product count */}
          <div className="product-count">
            {filteredProducts.length} out of {products.length} products
          </div>
        </div>
      </div>

      {/* Quick view modal */}
      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeQuickView}>×</button>
            <div className="modal-left">
              <img
                src={
                  quickViewProduct.image.startsWith("http")
                    ? quickViewProduct.image
                    : `http://localhost:8000/${quickViewProduct.image.replace(/^\/+/, "")}`
                }
                alt={quickViewProduct.product_name}
              />
            </div>
            <div className="modal-right">
              <div className="product-brand">
                {quickViewProduct.brand || quickViewProduct.product_name.split(' ')[0]}
              </div>
              <div className="product-name" style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px'}}>
                {quickViewProduct.product_name}
              </div>
              {quickViewProduct.description && (
                <div style={{margin: '12px 0', color: '#535766', fontSize: '14px'}}>
                  {quickViewProduct.description}
                </div>
              )}
              <div className="price-container" style={{marginBottom: '16px'}}>
                <div className="product-price">₹{quickViewProduct.amount}</div>
                {quickViewProduct.mrp && quickViewProduct.mrp > quickViewProduct.amount && (
                  <div className="product-mrp">₹{quickViewProduct.mrp}</div>
                )}
                {quickViewProduct.discountPercent > 0 && (
                  <div className="product-discount">({quickViewProduct.discountPercent}% OFF)</div>
                )}
              </div>
              {quickViewProduct.rating && (
                <div className="rating-container" style={{marginBottom: '16px'}}>
                  <div className="rating-badge">
                    {quickViewProduct.rating}
                    <svg viewBox="0 0 24 24" fill="white">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className="review-count">{quickViewProduct.reviews} reviews</div>
                </div>
              )}
              <div className="modal-actions">
                <button 
                  className="modal-cart-btn" 
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    closeQuickView();
                  }}
                >
                  ADD TO CART
                </button>
                <button 
                  className="modal-buy-btn"
                  onClick={() => handleBuyNow(quickViewProduct)}
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopNow;
