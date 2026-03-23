import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, Menu, X, User, ChevronRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user in Navbar", e);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
    // Poll for changes when navigating to catch login/logout across tabs
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'citizen') return '/citizen-dashboard';
    if (user.role === 'lawyer') return '/lawyer-dashboard';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Lawyers', path: '/find-lawyer' },
    { name: 'Resources', path: '/knowledge-hub' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <header className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="logo-icon-wrapper">
            <Scale size={24} className="logo-icon glow" />
          </div>
          <span className="logo-text">Justice<span className="text-highlight">Setu</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => {
              const handleNavClick = (e) => {
                if (link.path.startsWith('/#') && location.pathname === '/') {
                  e.preventDefault();
                  const targetId = link.path.substring(2);
                  const elem = document.getElementById(targetId);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
              };

              return (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                    onClick={handleNavClick}
                  >
                    {link.name}
                    {location.pathname === link.path && <div className="active-dot" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Auth/User Actions */}
        <div className="auth-buttons desktop-only">
          {user ? (
            <div className="user-menu-wrapper">
              <div className="user-badge" title={user.email}>
                <div className="user-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </div>
              
              <Link to={getDashboardLink()} className="btn-dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-group">
              <Link to="/login" className="btn-login-ghost">Sign In</Link>
              <Link to="/signup" className="btn-signup-glow">Get Started <ChevronRight size={16} /></Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content animate-slide-down">
          
          {user && (
            <div className="mobile-user-card">
              <div className="mobile-user-avatar">
                {user.profileImage ? <img src={user.profileImage} alt="User" /> : <User size={24} />}
              </div>
              <div>
                <h4 className="mobile-user-name">{user.name}</h4>
                <p className="mobile-user-role">{user.role}</p>
              </div>
            </div>
          )}

          <ul className="mobile-nav-links">
            {navLinks.map((link) => {
              const handleNavClick = (e) => {
                if (link.path.startsWith('/#') && location.pathname === '/') {
                  e.preventDefault();
                  const targetId = link.path.substring(2);
                  const elem = document.getElementById(targetId);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
                setIsMobileMenuOpen(false);
              };

              return (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={handleNavClick}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mobile-auth-section">
            {user ? (
              <div className="mobile-auth-actions">
                <Link to={getDashboardLink()} className="btn-full-width glow-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-full-width danger-btn">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/signup" className="btn-full-width glow-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
                <Link to="/login" className="btn-full-width ghost-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In to Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
