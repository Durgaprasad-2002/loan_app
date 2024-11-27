import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    amount: "",
    tenure: 1,
  });

  useEffect(() => {
    if (!user || user.userType !== "customer") return navigate("/login");
  }, []);

  function handleChange(e) {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(() => true);
    axios
      .post(
        "https://loan-app-znuq.onrender.com/api/loan",
        {
          ...formData,
          tenure: Number(formData.tenure),
          amount: Number(formData.amount),
          userId: user.userId,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      )
      .then((data) => {
        toast.success(data?.data?.message);
        navigate("/loans");
      })
      .catch((err) => {
        toast.warning("Failed to create loan");
        console.log(err);
      })
      .finally(() => setLoading(() => false));
  }

  return (
    <>
      <Navbar />
      <section className="dashboard">
        <form className="form-container-1" onSubmit={handleSubmit}>
          <h2>Create Loan </h2>
          <hr />
          <div className="form-fields-container">
            <label htmlFor="amount">Loan Amount</label>
            <input
              className="input-field"
              type="number"
              name="amount"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-fields-container">
            <label htmlFor="amount">Loan Tenure</label>
            <select
              className="input-field"
              name="tenure"
              required
              onChange={handleChange}
            >
              <option value="1">1 Week</option>
              <option value="2">2 Weeks</option>
              <option value="3">3 Weeks</option>
            </select>
          </div>

          <div className="form-fields-container">
            <button className="submit-btn" type="submit" disabled={loading}>
              {" "}
              {loading ? " Creating..." : " Create Loan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
