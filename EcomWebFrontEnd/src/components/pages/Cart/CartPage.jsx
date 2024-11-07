import { useEffect, useState } from 'react';
import CartPageCard from '../Cart/CartPageCard';
import './css/Cart.css'
import api from '../../../API/api';
import { Link } from 'react-router-dom'

const CartPage = ({setNumOfCartItem}) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal,setCartTotal] = useState({});
  const [cartAmount,setCartAmount] = useState(cartTotal.num_of_items==null || cartTotal.num_of_items==0 ? 0 : cartTotal.num_of_items)
  const cart_code = localStorage.getItem('cart_code')

  const subtotal = cartTotal.sum_total;
  const tax = cartTotal.sum_total* 0.05;
  const total = subtotal + tax;

  useEffect(()=>{
    try{
        const fetchCart = async ()=>{
        const res = await api.get(`get_cart?cart_code=${cart_code}`)
        if (res.data.message != "Cart Not Found")
        {setCartItems(res.data.items)
        setCartTotal(res.data)
        setCartAmount(res.data.num_of_items)
        setNumOfCartItem(res.data.num_of_items == null || res.data.num_of_items == 0 ? 0 : res.data.num_of_items)
      }
        }
        fetchCart();
      }
      catch(e){
        console.log(e.response);
      }
  },[cartAmount,cart_code])

  return (
<div className="cartContainer">
  <h2>Shopping Cart: {cartTotal.num_of_items == null?"No Product is added":cartTotal.num_of_items+"Product(s)"} </h2>
  <div className="cartItems">
    {cartItems.map((product) => (
      <CartPageCard
        key={product.id}
        product={product}
        setCartAmount={setCartAmount}
      />
    ))}
  </div>
  <div className="cartSummary">
    <h3>Cart Summary</h3>
    <p>Subtotal: Rs.{subtotal}</p>
    <p>Tax: Rs.{tax.toFixed(2)}</p>
    <p>Total: Rs.{total.toFixed(2)}</p>
    {
      (cartTotal.num_of_items == 0 || cartTotal.num_of_items == null)?
      <Link to="/">
        <button className="cartCheckoutButton">Go to Shopping</button>
      </Link>
      :
      <Link to="/checkout">
        <button className="cartCheckoutButton">Proceed to Checkout</button>
      </Link>
    }
  </div>
</div>
  );
};

export default CartPage;
