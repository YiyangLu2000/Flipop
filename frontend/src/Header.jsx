import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header d-flex justify-content-between align-items-center mt-3 mx-3">
      <div className="left">
        <Link to="/">Flipop</Link>
      </div>
      <div className="right d-flex gap-3">
        <Link to="/">Home</Link>
        <Link to="/login">Log In</Link>
      </div>
    </header>
  );
}

export default Header;
