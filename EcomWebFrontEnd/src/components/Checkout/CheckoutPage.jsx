import './css/style.css'
import CartSummary from './CartSummary';
import PaymentOptions from './PaymentOptions';

const CheckoutPage = () => {
    return (
      <div className="checkout-page">
        <CartSummary />
        <PaymentOptions />

      </div>
    );
  };
  
  export default CheckoutPage;