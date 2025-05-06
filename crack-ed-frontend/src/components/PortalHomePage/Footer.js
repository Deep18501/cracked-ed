import React from 'react';
import './Footer.css'; // for dark background and hover effects

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 px-3 text-center">
      <p className="small mb-3">&copy; 2024 Aurum Bankers Program. All rights reserved.</p>
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-4">
        <a href="#" className="footer-link">Privacy Policy</a>
        <a href="#" className="footer-link">Terms of Service</a>
        <a href="#" className="footer-link">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
