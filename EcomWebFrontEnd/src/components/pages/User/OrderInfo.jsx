import React from 'react';
import './css/OrderInfo.css';

const OrderInfo = () => {
  return (
    <div className="order-info">
      <h3>Order History</h3>
      <div className="order-card">
        <p><strong>Order Item:</strong> Product Name</p>
        <p><strong>Order Date:</strong> aaj kiya order </p>
        <p><strong>Order ID:</strong> 123456</p>
        <p><strong>Quantity:</strong> 1</p>
        <p><strong>Price:</strong> Rs.100.00</p>
      </div>
    </div>
  );
};

export default OrderInfo;
