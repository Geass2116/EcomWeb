import { useState } from 'react';
import './css/register.css';
import api from '../../../API/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    first_Name: '',
    last_Name: '',
    email: '',
    city: '',
    state: '',
    address: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handlePasswordToggle = (e) => {
    e.preventDefault(); // Prevent any default behavior
    setShowPassword((prev) => !prev);
    e.target.blur(); // Remove focus from the toggle element
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post('/register_user/', formData);
      toast.success("Registration successful!");
      navigate('/login');
    } catch (e) {

      if(e.response.data.username)
        toast.error(e.response.data.username[0]);
      else if(e.response.data.password)
        toast.error(e.response.data.password[0]);
      else
      toast.error("Registration Failed Please do it again")
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="off" // Disable autocomplete for security
            />
            <span className="toggle-password" onClick={handlePasswordToggle}>
            {showPassword ? "Hide" : "Show"}
            </span>

          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Make it toggleable too
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="first_Name"
              name="first_Name"
              value={formData.first_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="last_Name"
              name="last_Name"
              value={formData.last_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">Country</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="registration-button">Register</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Registration;
