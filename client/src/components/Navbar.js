import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';
import logo from '../assets/logo.png';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
             <img src={logo} alt="ZestyVerse Logo" className="logo-img" />
             <span>ZestyVerse</span>
        </Link>
        
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/submit-recipe">Submit Recipe</Link>
          
          {currentUser ? (
            <div className="user-menu">
              <Link to="/saved-recipes">Saved Recipes</Link>
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
          ) : (
            <Link to="/auth" className="login-btn">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;