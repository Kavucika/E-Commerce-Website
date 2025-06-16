import React, { useEffect, useState } from 'react';
import './OrdersStyles.css'; 

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
  <div className="orders-container">
    <h2 className="orders-title">Your Orders</h2>

    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order, index) => (
        <div key={index} className="order-card">
          <h3>Order #{index + 1}</h3>
          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Total:</strong> ₹{order.total.toLocaleString("en-IN")}</p>

          <div style={{ marginTop: '1rem' }}>
            <strong>Items:</strong>
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <img
                  src={
                    item.image?.startsWith('http')
                      ? item.image
                      : `http://localhost:8000/${item.image?.replace(/^\/+/, '')}`
                  }
                  alt={item.name}
                />
                <div className="item-details">
                  <p><strong>{item.name}</strong></p>
                  <p>Price: ₹{item.amount}</p>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Total: ₹{item.amount * (item.quantity || 1)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    )}
  </div>
);
};

export default OrdersSection;
