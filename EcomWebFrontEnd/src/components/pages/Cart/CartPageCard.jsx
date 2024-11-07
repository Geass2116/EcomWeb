import { useState,useEffect } from 'react';
import { BASE_URL } from '../../../API/constant';
import './css/Cart.css'
import api from '../../../API/api';
import { toast } from 'react-toastify';

const CartPageCard = ({ product,setCartAmount }) => {

  const [quantity,setQuantity] = useState(product.quantity)

  const itemData = {quantity:quantity,item_id:product.id}
  const itemID = {item_id:product.id}

  const updateQuantity = async ()=>{
  if(quantity!=product.quantity)
  {    
    try{
      const res = await api.patch('update_quantity/', itemData)
      console.log(res);
      setCartAmount(quantity)
      toast.success("Item Added to Cart Successfully")
    }
    catch(e)
    {
      console.log(e.message);
    }
  }
  }

  const deleteCartitem = async ()=>{
    const confirmDelete = window.confirm('Are you sure you wanna kick this out of the bucket')

    if(confirmDelete)
    {
      try{
        await api.post('delete_cartitem/',itemID)
        setCartAmount(null)
        toast.error("Item Deleted Successfully")
      }
      catch(e){
        console.log(e.message);
        
      }
    }
  }

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
    setQuantity(newQuantity);
  };


  return (
    <div className="cartItem">
  <img src={`${BASE_URL}${product.product.image}`} alt={product.product.name} className="cartProductImage" />
  <div className="cartProductDetails">
    <h3 className="cartProductDetailsHeading">{product.product.name}</h3>
    <p className="cartProductDetailsParagraph">Rs.{product.product.price}</p>
  </div>
  <div className="cartQuantityControls">
    <input
      type="number"
      value={quantity}
      min="1"
      max="5"
      onChange={handleQuantityChange}
      className="cartQuantityInput"
    />
    <button className="cartUpdateButton" onClick={updateQuantity}>
      Update Quantity
    </button>
    <button className="cartRemoveButton" onClick={deleteCartitem} >
      Remove
    </button>
  </div>
</div>

  );
};

export default CartPageCard;