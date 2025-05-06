import React, { useState } from 'react';
import './Header.css'; // For custom colors and tweaks
import auLogo from './au-logo.png';
import crackedLogo from './cracked-logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    window.location.href = "/portal/login"; 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="w-100">
      {/* Top Bar */}
      <div className="bg-purple text-white py-2 px-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logos */}
          <div className="d-flex align-items-center gap-3">
            {/* AU Logo + Divider */}
            <div className="d-flex align-items-center gap-2">
              <img src={auLogo} alt="AU Small Finance Bank" style={{ height: '64px' }} />
              <span className="vr text-white"></span>
            </div>

            {/* CRACKED Logo */}
            <img src={crackedLogo} alt="Cracked" style={{ height: '48px' }} />
          </div>

          {/* Hamburger Menu Button */}
          <button className="menu-toggle d-md-none" onClick={toggleMenu} aria-label="Toggle menu">
            &#9776;
          </button>

          {/* Navigation */}
          <nav className={`d-flex align-items-center gap-4 ${menuOpen ? 'open' : 'closed'}`}>
            <a href="#about" className="text-white small text-decoration-none hover-underline">About</a>
            <a href="#eligibility" className="text-white small text-decoration-none hover-underline">
              Eligibility & Selection Process
            </a>
            <a href="#why" className="text-white small text-decoration-none hover-underline">Why ABP?</a>
            <button className="btn-submit-login" onClick={handleLoginClick}>LogIn</button>
          </nav>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-orange text-white text-center small py-1 px-3">
        Applications are now open for the new batch starting in May 2025. Don’t miss out – seats are filling up quickly!
      </div>
    </header>
  );
};

export default Header;
