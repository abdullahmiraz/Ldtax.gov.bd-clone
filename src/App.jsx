import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Print from "./Print/Print";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import SiteUI from "./SiteUI/SiteUI";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="siteuimain">
      <div className="navbar-full">
        <div className="page-logo">
          <a href="https://office.land.gov.bd/">
            <img
              src="https://ldtax.gov.bd/assets/admin/layout4/img/logo-light.png"
              alt="logo"
              className="logo-default"
            />
          </a>
        </div>
        <img src="https://ldtax.gov.bd/assets/admin/layout4/img/nagorik.png" />
      </div>
      <SiteUI></SiteUI>
      <div className="footer"> 
          <div className="page-footer-inner">
            <a href="http://www.bangladesh.gov.bd/" target="_blank">
              <img
                src="https://ldtax.gov.bd/assets/admin/layout4/img/bd.png"
                alt=""
              />
            </a>{" "}
            <span className="title">
              ভূমি সংস্কার বোর্ড, ভূমি মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </span>
            &nbsp;&nbsp;
          </div>
          <div className="page-footer-inner pull-right">
            <span className="title">কারিগরি সহায়তায়</span> 
            <a href="http://mysoftheaven.com/" target="_blank">
              <img
                src="https://ldtax.gov.bd/img/auto.png"
                alt=""
                style={{ width: "140px" }}
              />
            </a>
            &nbsp;&nbsp;
          </div>  
      </div>
    </div>
  );
}

export default App;
