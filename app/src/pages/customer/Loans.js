import React from "react";

import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function Loans() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [ApprovalLoans, setInApproval] = useState([]);
  const [paidLoans, setPaidLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  function getData() {
    setLoading(() => true);
    axios
      .get(`https://loan-app-znuq.onrender.com/api/loan/loans/${user.userId}`, {
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((data) => {
        const { approved, pending, paid } = data?.data;
        setInApproval(() => approved);
        setPaidLoans(() => paid);
        setPendingLoans(() => pending);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(() => false);
      });
  }

  useEffect(() => {
    if (!user || user.userType !== "customer") return navigate("/login");
    getData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="outer-loans">
        {loading ? (
          <Loader />
        ) : (
          <>
            <section className="LoanCounts-2">
              <h2 className="title-loan">
                Approved Loans : {ApprovalLoans.length}
              </h2>
              <h2 className="title-loan">Paid Loans : {paidLoans.length}</h2>
            </section>
            <hr />
            <section>
              {pendingLoans.length !== 0 ? (
                <>
                  <h2 className="title-loan">Approval Required</h2>
                  <div className="pendin-loans">
                    {pendingLoans.map((data, ind) => (
                      <div className="loan-card-pend">
                        <h3>Loan : {data.amount}</h3>
                        <p>Tenure Weeks: {data.term}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3>There are no loans awaiting approval.</h3>
                </>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
