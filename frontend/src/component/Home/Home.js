import React, { Fragment } from 'react';
import { CgMouse } from "react-icons/all";
import './Home.css';
import Product from '../product/Product.js'
import MetaData from '../layout/MetaData';

const product = {
    name : 'Blue tshir',
    images : [{url :  'https://i.ibb.co/DRST11n/1.webp'}],
    size : window.innerWidth < 600 ? 20 : 25,
    price : "$3000",
    _id : "abhishek"
}

const Home = () => {
    return <Fragment>
       <MetaData title="Ecommerce"></MetaData>
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
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        </div>

        </Fragment>
}

export default Home
