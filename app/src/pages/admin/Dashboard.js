import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Loader from "../components/Loader";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [approved, setApprovedLoans] = useState([]);
  const [paid, setPaidLoans] = useState([]);

  function getData() {
    setLoading(() => true);
    axios
      .get("http://localhost:5000/api/admin/status", {
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((data) => {
        const { pending, approved, paid } = data?.data;
        setLoans(() => pending);
        setApprovedLoans(() => approved);
        setPaidLoans(() => paid);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading((prev) => false));
  }

  function approveLoan(data) {
    const id = data.loanId;
    setLoading(() => true);
    axios
      .put(
        `http://localhost:5000/api/admin/approve/${id}`,
        {},
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      )
      .then((data) => {
        alert("Loan Approved");
        getData();
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to Get Data");
      })
      .finally(() => setLoading(() => false));
  }

  useEffect(() => {
    if (!user || user.userType !== "admin") return navigate("/login");
    getData();
  }, []);

  return (
    <>
      <AdminNavbar />
      <section className="outer-loans">
        {loading ? (
          <Loader />
        ) : (
          <>
            {loans.length !== 0 && (
              <>
                <h2 className="title">New Loans</h2>
                <div className="LoanCounts">
                  {loans.map((data, ind) => {
                    return (
                      <div className="loan-card-pend " key={ind}>
                        <h3>{data.customer}</h3>
                        <h4>
                          Amount : {data.amount}{" "}
                          <p>Term Period : {data.term}</p>
                        </h4>
                        <p>
                          Status : <b>{data.status}</b>{" "}
                        </p>
                        <button
                          className="submit-btn"
                          onClick={() => approveLoan(data)}
                        >
                          Approve
                        </button>
                      </div>
                    );
                  })}
                </div>
                <hr />
              </>
            )}

            {approved.length !== 0 && (
              <>
                <h2 className="title">Approved Loans</h2>
                <div className="LoanCounts">
                  {approved.map((data, ind) => {
                    return (
                      <div className="loan-card-pend ">
                        <h3>{data.customer}</h3>
                        <h4>
                          Amount : {data.amount}{" "}
                          <p>Term Period : {data.term}</p>
                        </h4>
                        <p>
                          Status : <b>{data.status}</b>{" "}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <hr />
              </>
            )}

            {paid.length !== 0 && (
              <>
                <h2 className="title">Paid Loans</h2>
                <div className="LoanCounts">
                  {paid.map((data, ind) => {
                    return (
                      <div className="loan-card-pend ">
                        <h3>{data.customer}</h3>
                        <h4>
                          Amount : {data.amount}{" "}
                          <p>Term Period : {data.term}</p>
                        </h4>
                        <p>
                          Status : <b>{data.status}</b>{" "}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
