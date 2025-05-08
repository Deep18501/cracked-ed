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
    <header className="header-portal-main bg-purple">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container-bar">
          {/* Logos */}
          <div className="logo-section">
            <div className="logo-group">
              <img className='logo' src={auLogo} alt="AU Small Finance Bank" />
              <span className="vertical-line"></span>
            </div>
            <img className='logo' src={crackedLogo} alt="Cracked" />
          </div>

          {/* Hamburger Menu Button */}
          <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
            &#9776;
          </div>

          {/* Navigation */}
          <nav className={`${menuOpen ? 'open' : 'closed'}`}>
            <a href="#about" className="nav-link">About</a>
            <a href="#eligibility" className="nav-link">Eligibility & Selection Process</a>
            <a href="#why" className="nav-link">Why ABP?</a>
            <button className="btn-submit-login" onClick={handleLoginClick}>LogIn</button>
          </nav>      
          <nav className={`nav-links`}>
            <a href="#about" className="nav-link">About</a>
            <a href="#eligibility" className="nav-link">Eligibility & Selection Process</a>
            <a href="#why" className="nav-link">Why ABP?</a>
            <button className="btn-submit-login" onClick={handleLoginClick}>Log In</button>
          </nav>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="announcement-bar">
        Applications are now open for the new batch starting in May 2025. Don’t miss out – seats are filling up quickly!
      </div>
    </header>
  );
};

export default Header;