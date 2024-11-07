import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useEffect } from "react";
import api from "../../../API/api";

const Logout = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        const cart_code = localStorage.getItem('cart_code');
      
        try {
          await api.post('/merge_local_cart/', { cart_code });
        } catch (error) {
          console.error('Error merging local cart on logout:', error);
        }
      };
      
    useEffect(() => {
        const confirmDelete = window.confirm('Are you sure you want to log out?');
        if (confirmDelete) {
            handleLogout().then(() => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('username');
                setIsAuthenticated(false);
            }).catch(error => {
                console.error("Error during logout process:", error);
            });
        } else {
            navigate("/");
        }
    }, [navigate, setIsAuthenticated]);
    

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>User Logged Out</h1>
            <p style={styles.message}>Sorry to see you go! You can still check out our products below ⬇️</p>
            <Link to="/" style={styles.link}>Go back to Home</Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        color: '#343a40',
    },
    heading: {
        fontSize: '3rem',
        margin: '0',
    },
    message: {
        fontSize: '1.5rem',
        margin: '1rem 0',
    },
    link: {
        fontSize: '1.2rem',
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Logout;
