import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../API/api";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const location = useLocation();
    
    
    useEffect(() => {
        const authenticate = async () => {
            const token = localStorage.getItem("access");
            if (!token) {
                setIsAuthorized(false);
                return;
            }
      try {
        const decoded = jwtDecode(token);
        const expiryDate = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (expiryDate < currentTime) {

          await refreshToken();
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.log("Error decoding token:", error);
        setIsAuthorized(false);
      }
    };

    authenticate();
  }, []);

  async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }
    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshToken });

      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (e) {
      console.log(e);
      setIsAuthorized(false);
    }
  }


  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
