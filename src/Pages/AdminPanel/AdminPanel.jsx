import React from "react";

import "./AdminPanel.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //   const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    // change password authentication later
    if (email == "admin@admin.com" && password === "admin") {
      navigate("/dashboard");
    }else{
        alert("Wrong username/password")
    }
  };

  return (
    <div>
      <div className="hero min-h-screen bg-base-200 adminpanel-body">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center my-4 lg:text-left">
            <img src="https://office.land.gov.bd/img/logo-big.png" alt="" />
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl ">
            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-control border-0">
                <label className="label">
                  <span className="label-text">ব্যাবহারকারী</span>
                </label>
                <input
                name="email"
                  type="email"
                  placeholder="ব্যাবহারকারী"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control border-0">
                <label className="label">
                  <span className="label-text">পাসওয়ার্ড</span>
                </label>
                <input
                name="password"
                  type="password"
                  placeholder="পাসওয়ার্ড"
                  className="input input-bordered"
                  required
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    পাসওয়ার্ড পুনরুদ্ধার?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6 border-0">
                <button className="btn btn-primary">প্রবেশ</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
