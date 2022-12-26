import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import ReactStars from 'react-rating-stars-component'



const Product = ({product}) => {

    const options = {
        edit : false,
        color : "rgba(20,20,0,1)",
        activeColr : 'tomato',
        value : product.ratings || 2
    }
  
    return (
        <Link className="productCard" to={product._id} key={product._id}>
            <img src="https://i.ibb.co/DRST11n/1.webp" alt={product.name} />
            <h4 style={{marginTop:'10px'}}>{product.name}</h4>
            <div>
                <ReactStars {...options} /> <span> {product.numOfReviews} Reviews </span>
            </div>
            <span>${product.price}</span>
        </Link>
    ) 
}

export default Product
