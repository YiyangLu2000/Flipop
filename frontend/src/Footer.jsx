import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer d-flex justify-content-between align-items-center mt-4 w-50 mx-auto">
        <a href="/contact">Contact Us</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/service">Term of Service</a>
    </footer>
  );
}

export default Footer;