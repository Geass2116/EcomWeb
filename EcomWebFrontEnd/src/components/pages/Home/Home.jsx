import { useEffect,useState } from 'react';
import ProductList from '../Product/ProductList'
import api from '../../../API/api';
import { randomVaue } from '../../../API/constant';
import './home.css';
const Home = () => {
const [data, setData] = useState([]);

useEffect(() => {
    function setCartToLocalStorage() {
        if(localStorage.getItem('cart_code') === null)
            localStorage.setItem('cart_code',randomVaue)
    }
    const fetchData = async () => {
        try {
            const response = await api.get('products');
            setData(response.data);
        } catch (error) {
            console.log(error)
        }
    };
    fetchData();
    setCartToLocalStorage();
}, []);


return (
    <div>
        <div className="welcome-container">
            <h1>Welcome to EcomWeb!</h1>
            <p>Enjoy your shopping!</p>
        </div>
        <ProductList data = {data}/>
    </div>
)
}

export default Home
