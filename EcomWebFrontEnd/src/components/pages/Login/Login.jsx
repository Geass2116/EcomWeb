import { useContext, useState } from 'react';
import './css/style.css'; // Import the CSS file for styling
import api from '../../../API/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoCompleteBrowser,setAutoCompleteBrowser] = useState('on');
  const {setIsAuthenticated} = useContext(AuthContext);

  const location = useLocation()
  const navigate = useNavigate()

  const userInfo = {username,password}

  const mergeCarts = async (cart_code) => {
    try {
        const response = await api.post('/merge_user_cart_to_local/', { cart_code });
        console.log(response.data);
        return true
    } catch (error) {
        console.error(error);
        return false
    }
};


  const postData = async ()=>{
    try{
      setAutoCompleteBrowser("on")
      const res = await api.post('/api/token/', userInfo)
      localStorage.setItem('access',res.data.access)
      localStorage.setItem('refresh',res.data.refresh)
      localStorage.setItem('username',username)
      return true;
    }
    catch(e){
      if(e.response && e.response.status === 401)
        toast.error(`${e.response.data.detail}`)

      else
        console.log(e.message);
    }
    return false;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSuccess = await postData();

    if(isSuccess)
    {
      setPassword("")
      setUsername("")
      setIsAuthenticated(true)
      const cart_code = localStorage.getItem('cart_code')
      await mergeCarts(cart_code)
      const from = location.state?.from || "/"; 
      navigate(from)
    }
    else
      setAutoCompleteBrowser("off")
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete={autoCompleteBrowser}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete={autoCompleteBrowser}
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="login-options">
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          <p> 
            Dont have an account? 
            <Link to="/register" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
