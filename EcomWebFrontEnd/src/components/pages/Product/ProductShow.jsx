import './css/ProductShow.css';
import { BASE_URL } from '../../../API/constant';
import { Link } from 'react-router-dom';

const ProductShow = ({ item }) => {

  return (
    <div className="product-card" >
      <Link to={`/product/${item.slug}`}>
      <img src={`${BASE_URL}${item.image}`} alt={item.name} className="product-image" />
      <div className="product-details">
        <h2 className="product-name">{item.name}</h2>
        <p className="product-category">{item.category}</p>
        <p className="product-price">Rs.{item.price}</p>
      </div>
      </Link>
    </div>
  );
};

export default ProductShow;
