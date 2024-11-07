import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';  // Using the Layout component
import Home from './components/pages/Home/Home';
import Cart from './components/pages/Cart/Cart';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Login/Register';
import NotFound from './components/pages/NotFound';
import ProductDetail from './components/pages/Product/ProductDetail'
import Failure from './components/Checkout/Failure'
import Success from './components/Checkout/Success'
import { useEffect, useState } from 'react';
import api from './API/api';
import CheckoutPage from './components/Checkout/CheckoutPage';
import ProtectedRoute from './components/ui/ProtectedRoute';
import { AuthProvider } from './context/AuthContext'
import Logout from './components/pages/Login/Logout';
import UserProfile from './components/pages/User/UserProfile';
const App = () => {

  const [numOfCartItems,setNumOfCartItem] = useState(0);
  const cart_code = localStorage.getItem('cart_code')

  useEffect(()=>{
    const fetchCartState = async ()=>{
      if(cart_code)
        {
          try{
            const res = await api.get(`get_cart_stat?cart_code=${cart_code}`)
           
            if(res.data.message == "Cart Not Found")
              setNumOfCartItem(0);
            else
              setNumOfCartItem(res.data.num_of_items);
            
          } catch(e){
            console.log(e);
          }
        }
      }

    fetchCartState();
  })

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout numOfCartItems={numOfCartItems}/>}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart setNumOfCartItem={setNumOfCartItem} />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:slug" element={<ProductDetail setNumOfCartItem={setNumOfCartItem} />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
               <CheckoutPage />
            </ProtectedRoute>
            } />
          <Route path="logout" element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            } />
          <Route path="userprofile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
          <Route path="payment_success" element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            } />
          <Route path="payment_failure" element={
              <ProtectedRoute>
                <Failure />
              </ProtectedRoute>
            } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
