import React from "react";
import "./Header.css";

function Header({ onLoginClick }) {
  return (
    <header className="header d-flex justify-content-between align-items-center mt-3 mx-3">
      <div className="left">
        <a href="/">Flipop</a>
      </div>
      <div className="right d-flex gap-3">
        <a href="/">Home</a>
        <a onClick={onLoginClick}>
          Sign In/Up
        </a>
      </div>
    </header>
  );
}

export default Header;
