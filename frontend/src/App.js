 import './App.css';
import Header from './component/layout/Header/Header.js'
import Footer from './component/layout/Footer/Footer.js'
import {BrowserRouter as Router,Route } from "react-router-dom";
import { useEffect } from "react";
import WebFont from "webfontloader";
import Home from './component/Home/Home.js'



function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    })
  },[])
  
  return (
    <Router>
    <Header />
    <Route>
     <Route path="/" component={Home} exact />
    </Route>
    <Footer />
    </Router>
  );
}

export default App;
