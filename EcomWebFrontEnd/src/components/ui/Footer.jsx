import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <ul className="footer-list">
          <li className="footer-item">
            <a href="/" className="footer-link">Home</a>
          </li>
          <li className="footer-item">
            <a href="/about" className="footer-link">About Us</a>
          </li>
          <li className="footer-item">
            <a href="/contact" className="footer-link">Contact</a>
          </li>
          <li className="footer-item">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
          </li>
        </ul>
        <p className="footer-text">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;