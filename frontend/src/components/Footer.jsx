import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer section-dark">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">JusticeSetu</h3>
            <p className="footer-text">
              Making legal assistance accessible, understandable, and affordable for everyone through technology.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Linkedin size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/ai-legal-assistant">AI Legal Assistant</Link></li>
              <li><Link to="/find-lawyer">Find a Lawyer</Link></li>
              <li><Link to="/case-tracking">Case Tracking</Link></li>
              <li><Link to="/knowledge-hub">Legal Resources</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><Link to="#">Legal Consultation</Link></li>
              <li><Link to="#">Document Review</Link></li>
              <li><Link to="#">Case Management</Link></li>
              <li><Link to="#">Legal Research</Link></li>
              <li><Link to="#">Free Legal Aid</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>123 Legal Avenue, New Delhi</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>info@justicesetu.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JusticeSetu. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
