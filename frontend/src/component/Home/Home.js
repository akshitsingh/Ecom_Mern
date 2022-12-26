import React, { Fragment } from 'react';
import { CgMouse } from "react-icons/all";
import './Home.css';
import Product from '../product/Product.js'
import MetaData from '../layout/MetaData';
import {useSelector,useDispatch} from 'react-redux'
import { useEffect } from 'react';
import { getProduct } from '../../actions/productAction';
import Loader from '../loader/Loader';
  

const Home = () => {

  const dispatch = useDispatch();
  const {loading,products} = useSelector(state=>state.products);

  useEffect(()=>{
      dispatch(getProduct());
  },[dispatch])

    

    return (
    
    <Fragment>
      {loading ? <Loader /> :
         <div>
          <MetaData title="Home page"></MetaData>
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCT BELOW</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
        </div>

        <h1 className="homeHeading">Feature Products</h1>

        <div className="container">
        {
          products.map((prod)=> (
            <Product product={prod} key={prod._id}/>
          )
          )
        }
        
        </div>
         </div>
         }         
        </Fragment>
    )
}

export default Home
