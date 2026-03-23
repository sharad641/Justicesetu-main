import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Scale, LogOut, Menu, X, Bell, User } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = ({ role = 'citizen', links = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const userName = user?.name || (role === 'citizen' ? 'Citizen User' : role === 'lawyer' ? 'Advocate' : 'Admin User');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo dashboard-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Scale size={28} className="logo-icon" />
            {sidebarOpen && <span>JusticeSetu</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-links">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">{link.icon}</span>
                  {sidebarOpen && <span className="link-text">{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <span className="link-icon"><LogOut size={20} /></span>
            {sidebarOpen && <span className="link-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-breadcrumbs">
            <button className="mobile-sidebar-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="heading-3">Dashboard</h2>
          </div>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
