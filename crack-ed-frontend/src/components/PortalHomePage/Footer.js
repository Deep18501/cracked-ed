import React from 'react';
import './Footer.css'; // for dark background and hover effects

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 px-3 text-center">
      <p className="small mb-3">&copy; 2025 Aurum Bankers Program. All rights reserved.</p>
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-4">
        <a href="https://crack-ed.com/privacy-policy/" className="footer-link">Privacy Policy</a>
        <a href="https://crack-ed.com/terms-conditions/" className="footer-link">Terms of Service</a>
        <a href="https://crack-ed.com/contact-us/" className="footer-link">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
