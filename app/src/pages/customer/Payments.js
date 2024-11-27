import React from "react";
import Navbar from "../components/Navbar";
import "../styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

export default function Payments() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.userType !== "customer") return navigate("/login");
    getRepayments();
  }, []);

  function getRepayments() {
    setLoading(() => true);
    axios
      .get(
        `https://loan-app-znuq.onrender.com/api/loan/repayments/${user.userId}`,
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      )
      .then((data) => {
        setRepayments(() => data?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(() => false);
      });
  }

  function payLoan(data, ind) {
    const amount = document.getElementsByClassName("input-field")[ind].value;
    setLoading(() => true);
    axios
      .post(
        `https://loan-app-znuq.onrender.com/api/loan/repay/${data?.repaymentId}`,
        {
          amount: amount,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      )
      .then((data) => {
        toast.success("Payment Done");

        getRepayments();
      })
      .catch((err) => {
        console.log(err);
        toast.warning("Payment Failed");
      })
      .finally(() => {
        setLoading(() => false);
      });
  }

  return (
    <>
      <Navbar />
      <section className="outer-loans">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="title">Repayments</h2>
            <div className="repay-container">
              {repayments.map((data, ind) => {
                return (
                  <div className="loan-card-pend" key={ind}>
                    <h4>Due Amount : {Math.ceil(data.dueAmount)}</h4>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="input-field"
                    />
                    <button
                      className="submit-btn"
                      type="submit"
                      onClick={() => payLoan(data, ind)}
                    >
                      Pay Loan
                    </button>
                    <br />
                    <br />
                    <p>
                      {" "}
                      <i>
                        Due Date :{" "}
                        {new Date(data?.dueDate).toISOString().split("T")[0]}
                      </i>
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}
