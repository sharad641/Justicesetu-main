import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Calendar, Star, DollarSign, Briefcase, User as UserIcon, Scale, Mic, Headphones } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';
import './DashboardStyles.css';

export const LawyerDashboard = () => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDashboardData = async () => {
      try {
        const consData = await api.getMyConsultations();
        setConsultations(Array.isArray(consData) ? consData : []);
        
        try {
          const casesData = await api.getCases();
          setCases(casesData || []);
        } catch (err) {
          console.error("Failed to fetch cases:", err);
        }
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userName = user?.name || 'Advocate';
  const todaysConsultationsCount = consultations.filter(
    c => new Date(c.scheduledAt).toDateString() === new Date().toDateString()
  ).length;
  const pendingCasesCount = cases.filter(c => c.status === 'pending' || c.status === 'active').length;

  const handleSaveLink = async (id) => {
    if (!links[id]) return;
    setSaving(id);
    try {
      await api.updateConsultationLink(id, links[id]);
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, meetingLink: links[id] } : c));
    } catch (err) {
      console.error("Failed to save link:", err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome back, {userName}</h1>
          <p>You have {todaysConsultationsCount} consultations scheduled for today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon info">
            <Users size={28} />
          </div>
          <div className="stat-details">
            <h3>Active Clients</h3>
            <p>{loading ? '...' : (consultations.length || 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <Briefcase size={28} />
          </div>
          <div className="stat-details">
            <h3>Pending Cases</h3>
            <p>{loading ? '...' : pendingCasesCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <DollarSign size={28} />
          </div>
          <div className="stat-details">
            <h3>Revenue (This Month)</h3>
            <p>₹0</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2><Calendar size={20} /> Upcoming Consultations</h2>
          </div>
          <div className="panel-content">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading consultations...</p>
            ) : consultations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No consultations scheduled yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Client Name</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td>{new Date(c.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td>{c.Citizen?.name || 'Unknown Client'}</td>
                      <td>{c.issueDescription?.substring(0, 20) || 'General Consultation'}</td>
                      <td>
                        {c.meetingLink ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Join Meeting</a>
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setConsultations(prev => prev.map(item => item.id === c.id ? { ...item, meetingLink: null } : item))}>Edit</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                              type="url" 
                              placeholder="Paste Zoom link" 
                              value={links[c.id] || ''}
                              onChange={(e) => setLinks({ ...links, [c.id]: e.target.value })}
                              style={{ padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', width: '150px' }}
                            />
                            <button 
                              onClick={() => handleSaveLink(c.id)} 
                              className="btn btn-primary" 
                              style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                              disabled={saving === c.id || !links[c.id]}
                            >
                              {saving === c.id ? '...' : 'Set'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2><Star size={20} /> Recent Reviews</h2>
          </div>
          <div className="panel-content" style={{ padding: '16px' }}>
            <div className="action-list">
              <div className="action-item" style={{ cursor: 'default' }}>
                <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Star size={24} />
                </div>
                <div className="action-text">
                  <h4>Excellent advice</h4>
                  <p>By Manoj V. - 5 Stars</p>
                </div>
              </div>
              <div className="action-item" style={{ cursor: 'default' }}>
                <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Star size={24} />
                </div>
                <div className="action-text">
                  <h4>Very professional</h4>
                  <p>By Priya K. - 5 Stars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LawyerLayout = () => {
  const lawyerLinks = [
    { label: 'Dashboard', path: '/lawyer-dashboard', icon: <Briefcase size={20} /> },
    { label: 'My Clients', path: '/lawyer-dashboard/clients', icon: <Users size={20} /> },
    { label: 'Cases', path: '/lawyer-dashboard/cases', icon: <FileText size={20} /> },
    { label: 'Schedule', path: '/lawyer-dashboard/schedule', icon: <Calendar size={20} /> },
    { label: 'Payments', path: '/lawyer-dashboard/payments', icon: <DollarSign size={20} /> },
    { label: 'Doc Generator', path: '/lawyer-dashboard/document-generator', icon: <FileText size={20} /> },
    { label: 'Calculator', path: '/lawyer-dashboard/compensation-calculator', icon: <Scale size={20} /> },
    { label: 'Voice FIR', path: '/lawyer-dashboard/voice-fir', icon: <Mic size={20} /> },
    { label: 'Transcription', path: '/lawyer-dashboard/hearing-transcription', icon: <Headphones size={20} /> },
    { label: 'Profile & Settings', path: '/lawyer-dashboard/settings', icon: <UserIcon size={20} /> },
  ];
  return <DashboardLayout role="lawyer" links={lawyerLinks} />;
};
