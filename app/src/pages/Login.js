import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";

export default function Login() {
  let navigate = useNavigate();

  let [message, setMessage] = useState("");
  let [disable, setdisable] = useState(false);

  // ---------------- Form Hanlders and States ---------------
  let [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer",
  });

  function HandleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  // funtion to submit Form
  function HandleSubmit(e) {
    e.preventDefault();

    setdisable(() => true);

    axios
      .post("https://loan-app-znuq.onrender.com/auth/login", {
        ...formData,
      })
      .then((data) => {
        const { token, user } = data.data;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Verified User");
        navigate(`/${formData.userType === "admin" ? "admin" : ""}`);
      })
      .catch((err) => {
        const errmsg = err?.response?.data?.message || "An Error Occured!";
        setMessage(() => errmsg);
        console.log(err);
      })
      .finally(() => {
        setdisable(() => false);
      });
  }

  return (
    <>
      <div className="Container-login">
        <div className="login-box">
          <h2 className="title-login">Login</h2>
          <form action="post" onSubmit={HandleSubmit}>
            <div className="form-container">
              <label className="label">Email</label>
              <input
                className="input-field"
                type="email"
                name="email"
                onChange={HandleChange}
                placeholder="user@gmail.com"
                required
              />
            </div>
            <div className="form-container">
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                name="password"
                onChange={HandleChange}
                placeholder=""
                required
              />
            </div>
            <div className="form-container">
              <label className="label">Account Type</label>

              <select
                name="userType"
                className="input-field"
                required
                onChange={HandleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <p className="warning-msg">{message}</p>
            </div>

            <div className="form-container">
              <button type="submit" className="submit-btn" disabled={disable}>
                {disable ? "Verifying.." : "Login"}
              </button>
            </div>
            <div className="form-container">
              <p className="alternate-msg">
                Don't have an account?{"  "}
                <Link to="/register" className="links">
                  {" "}
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
