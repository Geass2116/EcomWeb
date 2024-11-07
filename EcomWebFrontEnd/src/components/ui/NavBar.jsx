import { Link } from 'react-router-dom';
import './NavBar.css';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const NavBar = ({ numOfCartItems }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const authUsername = localStorage.getItem('username');

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-home">
          <Link to="/" className="navbar-link home-link"> EcomWeb </Link> 
        </div>
        <ul className="navbar-list">
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/cart" className="navbar-link"> Cart: {numOfCartItems}</Link>
              </li>
              <li className="navbar-item">
                <Link to="/userprofile" className="navbar-link">{authUsername}</Link>
              </li>
              <li className="navbar-item">
                <Link to="/logout" className="navbar-link"> Logout </Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/cart" className="navbar-link"> Cart: {numOfCartItems}</Link>
              </li>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link"> Login </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link"> Register </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;