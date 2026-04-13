import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';
import logo from '../assets/logo.png';

// React Icons
import {
  FaHome,
  FaPlus,
  FaStar,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaChevronDown,
  FaUtensils
} from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
             <img src={logo} alt="ZestyVerse Logo" className="logo-img" />
             <span>ZestyVerse</span>
        </Link>

        {/* Navigation */}
        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">

            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              <FaHome className="nav-icon" /> Home
            </Link>

            <Link to="/submit-recipe" className="nav-link" onClick={closeMobileMenu}>
              <FaPlus className="nav-icon" /> Submit Recipe
            </Link>

            {currentUser && (
              <>
                <Link to="/saved-recipes" className="nav-link" onClick={closeMobileMenu}>
                  <FaStar className="nav-icon" /> Saved Recipes
                </Link>

                {/* <Link to="/create-recipe" className="nav-link create-recipe-btn" onClick={closeMobileMenu}>
                  <FaUtensils className="nav-icon" /> Create Recipe
                </Link> */}
              </>
            )}
          </div>

          {/* User Section */}
          <div className="user-section">
            {currentUser ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button className="user-toggle-btn" onClick={toggleUserMenu}>
                  <div className="user-avatar-small">
                    <img src={currentUser.photoURL || '/default-avatar.png'} alt="Profile" />
                  </div>

                  <span className="user-name-short">
                    {currentUser.displayName?.split(' ')[0] || 'User'}
                  </span>

                  <FaChevronDown className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`} />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">

                    <div className="dropdown-header">
                      <div className="user-avatar-large">
                        <img src={currentUser.photoURL || '/default-avatar.png'} alt="Profile" />
                      </div>

                      <div className="user-info">
                        <div className="user-name">{currentUser.displayName || 'User'}</div>
                        <div className="user-email">{currentUser.email}</div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link to="/profile" className="dropdown-item" onClick={() => { closeUserMenu(); closeMobileMenu(); }}>
                      <FaUser className="dropdown-icon" /> My Profile
                    </Link>

                    <Link to="/saved-recipes" className="dropdown-item" onClick={() => { closeUserMenu(); closeMobileMenu(); }}>
                      <FaStar className="dropdown-icon" /> Saved Recipes
                    </Link>

                    <Link to="/create-recipe" className="dropdown-item" onClick={() => { closeUserMenu(); closeMobileMenu(); }}>
                      <FaUtensils className="dropdown-icon" /> Create Recipe
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt className="dropdown-icon" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">

                <Link to="/auth" className="login-btn" onClick={closeMobileMenu}>
                  <FaSignInAlt className="btn-icon" /> Login
                </Link>
              {/* 
                <Link to="/auth" className="signup-btn" onClick={closeMobileMenu}>
                  <FaUserPlus className="btn-icon" /> Sign Up
                </Link> */}

              </div>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
        )}

      </div>
    </header>
  );
};

export default Header;