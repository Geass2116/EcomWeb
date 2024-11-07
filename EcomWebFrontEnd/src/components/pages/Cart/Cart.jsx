import CartPage from "./CartPage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = ({setNumOfCartItem}) => {
  return (
    <div>
      <CartPage setNumOfCartItem={setNumOfCartItem}/>
      <ToastContainer />
    </div>
  )
}

export default Cart
