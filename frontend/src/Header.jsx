import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header d-flex justify-content-between align-items-center p-3">
      <div className="left">
        <a>Flipop</a>
      </div>
      <div className="right d-flex gap-3">
        <a href="/home">Home</a>
        <a href="/login">Log in</a>
      </div>
    </header>
  );
}

export default Header;
