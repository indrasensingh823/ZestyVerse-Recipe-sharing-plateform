import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './Footer.css';

// React Icons
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitMessage('Thank you for your feedback! We appreciate your input.');
      setFormData({ name: '', email: '', feedback: '', rating: 5 });

      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      setSubmitMessage('Sorry, there was an error submitting your feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social Links
  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://facebook.com' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com' },
    { name: 'YouTube', icon: <FaYoutube />, url: 'https://youtube.com' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Submit Recipe', path: '/submit-recipe' },
    { name: 'Browse Recipes', path: '/recipes' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const policyLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' }
  ];

  return (
    <footer className="footer-container">
      <div className="footer-wave"></div>

      <div className="footer-content">

        {/* Brand */}
        <div className="footer-section brand-section">
          <div className="footer-logo">
          <img src={logo} alt="ZestyVerse Logo" className="logo-img" />
            <h3>ZestyVerse</h3>
          </div>

          <p className="brand-description">
            Discover, share, and create amazing recipes with our community of food lovers.
          </p>

          <div className="social-links">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noreferrer">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link, i) => (
              <li key={i}>
                <a href={link.path}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact Info</h4>

          <p><FaEnvelope /> support@zestyverse.com</p>
          <p><FaPhone /> +91 98765 43210</p>
          <p><FaMapMarkerAlt /> 123 Food Street</p>
        </div>

        {/* Feedback */}
        <div className="footer-section">
          <h4>Feedback</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Rating */}
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => handleRatingChange(star)}>
                  <FaStar color={star <= formData.rating ? 'gold' : 'gray'} />
                </span>
              ))}
            </div>

            <textarea
              name="feedback"
              placeholder="Your feedback..."
              value={formData.feedback}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>

          {submitMessage && <p>{submitMessage}</p>}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ZestyVerse</p>

        <div>
          {policyLinks.map((link, i) => (
            <a key={i} href={link.path}>{link.name}</a>
          ))}
        </div>

        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;