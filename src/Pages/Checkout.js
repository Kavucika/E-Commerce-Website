import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [payment, setPayment] = useState("cod");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    holder: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 49,
    total: 0,
  });

  useEffect(() => {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);

    // Calculate totals
    const subtotal = cart.reduce(
      (sum, item) => sum + item.amount * (item.quantity || 1),
      0
    );

    const discount = cart.reduce((sum, item) => {
      const mrp = item.mrp || item.amount;
      return sum + (mrp - item.amount) * (item.quantity || 1);
    }, 0);

    // Free shipping for orders above ₹799
    const shipping = subtotal > 799 ? 0 : 49;

    setTotals({
      subtotal,
      discount,
      shipping,
      total: subtotal + shipping,
    });
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment(e.target.value);
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !address.name ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.country
    ) {
      alert("Please fill all address fields");
      return;
    }

    if (payment === "card") {
      // Basic card validation
      if (
        !card.number ||
        !card.expiry ||
        !card.cvv ||
        !card.holder ||
        card.number.length < 12 ||
        card.cvv.length < 3
      ) {
        alert("Please fill all card details correctly.");
        return;
      }
    }
    // Add this where your order is confirmed
    const order = {
      id: Date.now(), // unique order ID
      items: cartItems, // you probably already have this
      total: totals.total, // calculate this based on items
      date: new Date().toLocaleString(),
    };

// Get existing orders
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

// Add new order to the list
    existingOrders.push(order);

// Save back to localStorage
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    // Clear cart after successful order
    localStorage.setItem("cart", "[]");
    setSubmitted(true);
    // Here you would send the order to your backend
  };

  return (
    <div className="checkout-page">
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

          .checkout-page {
            min-height: 100vh;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px 0 60px;
          }
          
          .checkout-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
          }
          
          @media (min-width: 768px) {
            .checkout-container {
              flex-direction: row;
              align-items: flex-start;
              gap: 30px;
            }
          }
          
          .checkout-form-container {
            flex-grow: 1;
            background: var(--bg-secondary);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            padding: 24px;
            margin-bottom: 20px;
            border: 1px solid var(--border-color);
          }
          
          .order-summary {
            width: 100%;
            background: var(--bg-secondary);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            padding: 24px;
            position: sticky;
            top: 80px;
            border: 1px solid var(--border-color);
          }
          
          @media (min-width: 768px) {
            .order-summary {
              width: 360px;
              flex-shrink: 0;
            }
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            margin: 0 0 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .checkout-form label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-primary);
            font-size: 14px;
          }
          
          .checkout-form input,
          .checkout-form select {
            width: 100%;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            background: var(--bg-element);
            color: var(--text-primary);
            font-size: 14px;
            margin-bottom: 16px;
            outline: none;
            transition: border 0.2s;
          }
          
          .checkout-form input:focus,
          .checkout-form select:focus {
            border-color: var(--brand-color);
          }
          
          .address-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          @media (min-width: 640px) {
            .address-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          
          .payment-methods {
            margin-bottom: 20px;
          }
          
          .payment-option {
            display: flex;
            align-items: center;
            padding: 14px;
            margin-bottom: 10px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            background: var(--bg-element);
          }
          
          .payment-option.selected {
            border-color: var(--brand-color);
            background: rgba(255, 63, 108, 0.1);
          }
          
          .payment-radio {
            margin-right: 10px;
            accent-color: var(--brand-color);
            width: 18px;
            height: 18px;
          }
          
          .payment-label {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-primary);
          }
          
          .card-icon {
            margin-left: auto;
            display: flex;
            gap: 6px;
          }
          
          .card-icon img {
            height: 20px;
            border-radius: 4px;
          }
          
          .card-fields {
            background: var(--bg-element);
            padding: 20px;
            margin-top: 10px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
          }
          
          .card-row {
            display: flex;
            gap: 16px;
          }
          
          .card-col {
            flex: 1;
          }
          
          .place-order-btn {
            width: 100%;
            padding: 14px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .place-order-btn:hover {
            background: var(--brand-light);
          }
          
          /* Order summary styles */
          .order-item {
            display: flex;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .order-item-img {
            width: 60px;
            height: 80px;
            object-fit: cover;
            margin-right: 12px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
          }
          
          .order-item-details {
            flex: 1;
          }
          
          .order-item-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
          }
          
          .order-item-price {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
          }
          
          .current-price {
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .original-price {
            text-decoration: line-through;
            color: var(--text-muted);
          }
          
          .discount-percent {
            color: var(--warning-color);
          }
          
          .order-item-qty {
            color: var(--text-secondary);
            font-size: 12px;
            margin-top: 4px;
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
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
            font-size: 16px;
            font-weight: 700;
          }
          
          .discount-row .price-value {
            color: var(--success-color);
          }
          
          .success-container {
            text-align: center;
            padding: 60px 20px;
            background: var(--bg-secondary);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border: 1px solid var(--border-color);
          }
          
          .success-icon {
            width: 80px;
            height: 80px;
            background: var(--success-color);
            border-radius: 50%;
            color: white;
            font-size: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          
          .success-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
          }
          
          .success-message {
            color: var(--text-secondary);
            margin-bottom: 30px;
            font-size: 16px;
          }
          
          .continue-shopping {
            display: inline-block;
            padding: 12px 24px;
            background: var(--brand-color);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
          }
          
          .continue-shopping:hover {
            background: var(--brand-light);
          }
          
          .page-title {
            font-size: 18px;
            color: var(--text-primary);
            margin: 0 0 20px;
            font-weight: 600;
          }
          
          .secure-checkout {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--success-color);
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
          }
        `}
      </style>

      <div className="checkout-container">
        {submitted ? (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <div className="success-title">Order Placed Successfully!</div>
            <div className="success-message">
              Your order has been placed and will be delivered soon.
              <br />
              Thank you for shopping with Tint.
            </div>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="checkout-form-container">
              <div className="secure-checkout">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-6h-2V6h2v4z" />
                </svg>
                SECURE CHECKOUT
              </div>

              <div className="page-title">Checkout</div>

              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="section-title">Shipping Address</div>

                <div className="address-grid">
                  <div>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile">Mobile Number</label>
                    <input
                      type="tel"
                      id="mobile"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>

                <label htmlFor="street">Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                  placeholder="House No, Building, Street, Area"
                />

                <div className="address-grid">
                  <div>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="address-grid">
                  <div>
                    <label htmlFor="zip">PIN Code</label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={address.zip}
                      onChange={handleAddressChange}
                      required
                      placeholder="PIN Code"
                    />
                  </div>

                  <div>
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      required
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="section-title">Payment Method</div>

                <div className="payment-methods">
                  <div
                    className={`payment-option${
                      payment === "cod" ? " selected" : ""
                    }`}
                    onClick={() => setPayment("cod")}
                  >
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={handlePaymentChange}
                      className="payment-radio"
                    />
                    <label htmlFor="cod" className="payment-label">
                      Cash on Delivery
                    </label>
                  </div>

                  <div
                    className={`payment-option${
                      payment === "card" ? " selected" : ""
                    }`}
                    onClick={() => setPayment("card")}
                  >
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={payment === "card"}
                      onChange={handlePaymentChange}
                      className="payment-radio"
                    />
                    <label htmlFor="card" className="payment-label">Credit/Debit Card</label>
                    <div className="card-icon">
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" />
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" />
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="RuPay" />
                    </div>
                  </div>
                  
                  {payment === "card" && (
                    <div className="card-fields">
                      <label htmlFor="card-number">Card Number</label>
                      <input
                        type="text"
                        id="card-number"
                        name="number"
                        value={card.number}
                        onChange={handleCardChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength="16"
                        required={payment === "card"}
                      />

                      <div className="card-row">
                        <div className="card-col">
                          <label htmlFor="card-expiry">Valid Thru</label>
                          <input
                            type="text"
                            id="card-expiry"
                            name="expiry"
                            value={card.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            required={payment === "card"}
                          />
                        </div>

                        <div className="card-col">
                          <label htmlFor="card-cvv">CVV</label>
                          <input
                            type="password"
                            id="card-cvv"
                            name="cvv"
                            value={card.cvv}
                            onChange={handleCardChange}
                            placeholder="CVV"
                            maxLength="3"
                            required={payment === "card"}
                          />
                        </div>
                      </div>

                      <label htmlFor="card-name">Name on Card</label>
                      <input
                        type="text"
                        id="card-name"
                        name="holder"
                        value={card.holder}
                        onChange={handleCardChange}
                        placeholder="Name as on card"
                        required={payment === "card"}
                      />
                    </div>
                  )}
                </div>

                <button className="place-order-btn" type="submit">
                  Place Order
                </button>
              </form>
            </div>

            <div className="order-summary">
              <div className="section-title">Order Summary</div>

              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `http://localhost:8000/${item.image?.replace(/^\/+/, "")}`
                      }
                      alt={item.product_name}
                      className="order-item-img"
                    />
                    <div className="order-item-details">
                      <div className="order-item-name">
                        {item.product_name}
                      </div>
                      <div className="order-item-price">
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
                      <div className="order-item-qty">
                        Qty: {item.quantity || 1}
                        {item.selectedSize && ` | Size: ${item.selectedSize}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="price-summary">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">₹{totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="price-row discount-row">
                    <span className="price-label">Discount</span>
                    <span className="price-value">-₹{totals.discount}</span>
                  </div>
                )}
                <div className="price-row">
                  <span className="price-label">Shipping</span>
                  <span className="price-value">
                    {totals.shipping === 0 ? "FREE" : `₹${totals.shipping}`}
                  </span>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <span>₹{totals.total}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
