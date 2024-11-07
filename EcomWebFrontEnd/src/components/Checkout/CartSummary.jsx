import api from '../../API/api';
import { BASE_URL } from '../../API/constant';
import './css/style.css'
import { useEffect, useState } from 'react';

const CartSummary = () => {
    const [items,setItems] = useState({})
    const cart_code = localStorage.getItem('cart_code')
    

    useEffect(()=>{
        try{
            const fetchCart = async ()=>{
            const res = await api.get(`get_cart?cart_code=${cart_code}`)
            // console.log(res.data);
            setItems(res.data)
            }
            fetchCart();
          }
          catch(e){
            console.log(e);
          }
      },[cart_code])


  const subtotal = isNaN(items.sum_total)?0:items.sum_total;
  const tax = subtotal* 0.05;
  const total = subtotal + tax;
    return (
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        {
            !items.items || !items.items.length?
            <p>Your cart is empty.</p>:
        items.items.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={`${BASE_URL}${item.product.image}`} alt={item.product.name} className="item-image" />
            <div className="item-details">
              <span>{item.product.name}</span>
              <span>Quantity: {item.quantity}</span>
              <span>Rs.{item.product.price}.00</span>
            </div>
          </div>
        ))}
        <div className="total">
          <h3>Total</h3>
          <span>Rs.{total.toFixed(2)}</span>
        </div>
      </div>
    );
  };
  export default CartSummary;