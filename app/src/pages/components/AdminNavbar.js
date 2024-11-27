import React, { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const barStyle = {
    backgroundColor: toggle ? "black" : "white",
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsUserLogged(true);
      setUserData(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsUserLogged(false);
    setUserData(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <div className="navbar">
        <nav className="inner-nav">
          <Link to="/admin">
            <h2 className="brand">Loan Lelo</h2>
          </Link>

          <button
            className={`${toggle ? "nav-btn" : "toggle-btn"}`}
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle Navigation"
          >
            <div
              className="hor-bar"
              style={{
                ...barStyle,
                transform: toggle ? "rotate(45deg)" : "rotate(0)",
                marginTop: toggle ? "10px" : "5px",
              }}
            ></div>
            <div
              className="hor-bar"
              style={{
                opacity: toggle ? "0" : "1",
              }}
            ></div>
            <div
              className="hor-bar"
              style={{
                ...barStyle,
                transform: toggle ? "rotate(-45deg)" : "rotate(0)",
                marginTop: toggle ? "-18px" : "0px",
                marginBottom: toggle ? "9px" : "5px",
              }}
            ></div>
          </button>
        </nav>
      </div>

      <div className={`nav-layout ${toggle ? "show-nav" : "hide-nav"}`}>
        <ul className="nav-links">
          <li className="nav-link-item" onClick={() => setToggle(false)}>
            <Link to="/admin">Dashboard</Link>
          </li>

          {isUserLogged ? (
            <>
              <li className="nav-link-item" onClick={() => setToggle(false)}>
                <span style={{ color: "black" }}>
                  Welcome, {userData?.username}
                </span>
              </li>
              <li className="nav-link-item" onClick={handleLogout}>
                <span className="Logout">Logout</span>
              </li>
            </>
          ) : (
            <>
              <li className="nav-link-item" onClick={() => setToggle(false)}>
                <Link to="/login">Login</Link>
              </li>
              <li className="nav-link-item" onClick={() => setToggle(false)}>
                <Link to="/signup">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default memo(AdminNavbar);
