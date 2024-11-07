import { useState } from 'react';
import api from '../../API/api';
import './css/style.css';

const PaymentOptions = () => {
  const cartCode = localStorage.getItem('cart_code');
  const [paymentParams, setPaymentParams] = useState(null);

  const initiatePayment = async () => {
    try {
      const response = await api.post('/initiate_payu_payment/', { cart_code: cartCode });
      setPaymentParams(response.data.order_data); // Save parameters from the backend
      console.log(response.data.order_data);
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const renderPaymentForm = () => {
    if (!paymentParams) return null;

    return (
      <form action="https://test.payu.in/_payment" method="POST" id="payuForm">
        {Object.entries(paymentParams).map(([key, value]) => (
          <input type="hidden" key={key} name={key} value={value} />
        ))}
        <button type="submit" className="paypal-btn">Proceed with Payment</button>
      </form>
    );
  };

  return (
    <div className="payment-options">
      <h2>Proceed to Payment</h2>
      {paymentParams == null ?<button onClick={initiatePayment} className="paystack-btn">Pay Right Now with PayU</button> :<span></span>}
      {renderPaymentForm()}
    </div>
  );
};

export default PaymentOptions;
