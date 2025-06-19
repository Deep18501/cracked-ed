import React, { useState, useContext } from 'react';
import './Header.css';
import auLogo from './au-logo.png';
import crackedLogo from './cracked-logo.png';
import { AuthContext } from '../../context/AuthContext'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/portal/login");
  };
  const handleRegisterClick = () => {
    navigate("/portal/register");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

          {/* Hamburger Menu */}
          <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
            &#9776;
          </div>

          {/* Responsive Navigation */}
          <nav className={`${menuOpen ? 'open' : 'closed'}`}>
            <a href="#about" className="nav-link">About</a>
            <a href="#eligibility" className="nav-link">Eligibility & Selection Process</a>
            <a href="#why" className="nav-link">Why ABP?</a>
            <div className="nav-auth-buttons">
              {isAuthenticated ? (
                <>
                  <button className="nav-auth-btn register" onClick={() => navigate('/portal/dashboard')}>
                    View Application
                  </button>
                  <button className="nav-auth-btn logout" onClick={handleLogout}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button className="nav-auth-btn login" onClick={handleLoginClick}>Log In</button>
                  <a
                    href="/portal/register"
                    className="nav-auth-btn register"
                    style={{ marginLeft: '2px', textDecoration: 'none' }}
                  >
                    Register Now
                  </a>
                </>
              )}
            </div>
          </nav>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#eligibility" className="nav-link">Eligibility & Selection Process</a>
            <a href="#why" className="nav-link">Why ABP?</a>
            <div className="nav-auth-buttons">
              {isAuthenticated ? (
                <>
                  <button className="nav-auth-btn register" onClick={() => navigate('/portal/dashboard')}>
                    View Application
                  </button>
                  <button className="nav-auth-btn logout" onClick={handleLogout}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button className="nav-auth-btn login" onClick={handleLoginClick}>Log In</button>
                  <a
                    href="/portal/register"
                    className="nav-auth-btn register"
                    style={{ marginLeft: '8px', textDecoration: 'none' }}
                  >
                    Register Now
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="announcement-bar">
        Applications are now open for the new batch starting in July 2025. Don't miss out – seats are filling up quickly!
      </div>
    </header>
  );
};

export default Header;
