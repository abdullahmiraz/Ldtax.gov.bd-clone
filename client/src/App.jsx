import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { Link } from "react-router-dom";
import Print from "./Pages/Print/Print";
import { AppContext } from "./Context/ContextProvider";

function App() {
  const [count, setCount] = useState(0);
  const { printPdf, setPrintPdf } = useContext(AppContext);

  return (
    <div className="siteuimain">
      <div className="navbar-full">
        <div className="page-logo">
          <Link to={`/adminpanel`}>
            <img
              src="https://ldtax.gov.bd/assets/admin/layout4/img/logo-light.png"
              alt="logo"
              className="logo-default"
            />
          </Link>
        </div>
        <img src="https://ldtax.gov.bd/assets/admin/layout4/img/nagorik.png" />
      </div> 
      <Print link={printPdf}></Print>
      <div className="footer">
        <div className="page-footer-inner flex items-center">
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
        <div className="page-footer-inner pull-right flex items-center">
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
