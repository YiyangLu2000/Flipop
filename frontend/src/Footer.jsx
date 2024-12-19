import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer d-flex justify-content-between align-items-center mt-4 w-50 mx-auto">
      <div className="d-flex gap-5 justify-content-center w-100">
        <a href="/contact" className="footer-link">Contact Us</a>
        <a href="/privacy" className="footer-link">Privacy Policy</a>
        <a href="/service" className="footer-link">Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;