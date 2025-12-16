import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>Employee Management System</h1>
        </div>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/departments"
            className={`nav-link ${
              location.pathname === "/departments" ? "active" : ""
            }`}
          >
            Departments
          </Link>
          <Link
            to="/employees"
            className={`nav-link ${
              location.pathname === "/employees" ? "active" : ""
            }`}
          >
            Employees
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
