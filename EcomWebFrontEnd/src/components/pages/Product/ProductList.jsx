import ProductShow from './ProductShow'
import './css/ProductShow.css';

const ProductList = ({data}) => {

    return (
      <div className='product-list'>
        {data.map((item) => {
        return (
          <ProductShow key = {item.id} item={item}/>
        );
      })}
      </div>
    )
}

export default ProductList

