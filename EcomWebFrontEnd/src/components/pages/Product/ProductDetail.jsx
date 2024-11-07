import { useEffect,useState } from "react"
import api from '../../../API/api'
import { useParams } from "react-router-dom";
import './css/ProductDetail.css'
import { BASE_URL } from "../../../API/constant";
import ProductShow from "../Product/ProductShow";
import { Link } from "react-router-dom";

const ProductDetail = ({ setNumOfCartItem }) => {
  const [data, setData] = useState([]);
  const { slug } = useParams()
  const cart_code = localStorage.getItem('cart_code')
  const [addedToCart,setAddedToCart] = useState(false)
  const add_item = async ()=>{
    try {
      // console.log(data.id)
      const res = await api.post('add_item/', {cart_code:cart_code, product_id:data.id});
      // console.log(res)
      setNumOfCartItem(curr => curr+1)
      setAddedToCart(true)
    } catch (error) {
      console.log(error)
  }
  }
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await api.get(`/product_detail/${slug}`);
            setData(response.data);
        } catch (error) {
            console.log(error)
        }
    };
    fetchData();
    if(data.id){
      const checkProductInCart = async ()=>{
        
        try{
          
          const res = await api.get(`product_in_cart?cart_code=${cart_code}&product_id=${data.id}`)
          setAddedToCart(res.data.product_in_cart)
        } catch (error) {
          console.log(error)
        }
      } 
      checkProductInCart();
    }
}, [slug,cart_code,data.id]);

  return (
    <>
<div className="product-detail">
      <div className="product-image">
        <img src={`${BASE_URL}${data.image}`} alt={data.name}/>
      </div>
      <div className="product-info">
        <h1>{data.name}</h1>
        <p><strong>Category:</strong> {data.category}</p>
        <p><strong>Price:</strong> Rs.{data.price}</p>
        <p>{data.description}</p>
        {
          !addedToCart ?
            <button className="add-to-cart" onClick={add_item}>Add to cart</button>
            :
          <Link to='/cart'>
            <button className="add-to-cart">Go to cart</button>
          </Link>
        }
      </div>
    </div>
    <div className="related-products">
        <h2>Related Products:</h2>
        <div className="product-list">
        {
          data.similar_products && data.similar_products.length > 0 ? (
            data.similar_products.map((item) => {
              return (
                <ProductShow key={item.id} item={item} />
              );
            })
          ) : (
            <p>No related products found.</p>
          )
        }
        </div>
      </div>
    </>
  )
}

export default ProductDetail
