import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';
import logo from '../assets/logo.png';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false); // close menu on logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="ZestyVerse Logo" className="logo-img" />
          <span>ZestyVerse</span>
        </Link>

        {/* Hamburger button (visible on mobile) */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation menu */}
        <nav ref={navRef} className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/submit-recipe" onClick={closeMenu}>Submit Recipe</Link>
            
            {currentUser ? (
              <>
                <Link to="/saved-recipes" onClick={closeMenu}>Saved Recipes</Link>
                <div className="user-menu">
                  <div className="user-info">
                    <img 
                      src={currentUser.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="avatar"
                    />
                    <span>{currentUser.displayName || currentUser.email}</span>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/auth" className="login-btn" onClick={closeMenu}>
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;