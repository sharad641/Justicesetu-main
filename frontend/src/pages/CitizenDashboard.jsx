import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, Bell, Settings, Bot, Search, Calendar, ChevronRight, UserPlus, Scale, Mic, Calculator, FileSignature, Headphones, Shield } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';
import './DashboardStyles.css';

export const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState({});
  const [saving, setSaving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDashboardData = async () => {
      try {
        const casesData = await api.getCases();
        setCases(casesData || []);
        
        try {
          const consData = await api.getMyConsultations();
          setConsultations(Array.isArray(consData) ? consData : []);
        } catch (err) {
          console.error("No consultations or API error");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userName = user?.name || 'Citizen';
  const activeCasesCount = cases.filter(c => c.status === 'Active' || c.status === 'Pending').length;
  const upcomingCount = consultations.filter(c => c.status === 'pending' || c.status === 'approved').length;

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
      
      {/* Primary Funnel CTA Banner */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>Welcome back, {userName}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your centralized legal command center. Manage your cases or start a new legal journey today.</p>
          </div>

          {!loading && cases.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '24px', borderRadius: '12px' }}>
              <Scale size={48} style={{ color: 'var(--primary-glow)' }} />
              <div>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Ready to resolve your legal issue?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Follow our streamlined process: Find an expert lawyer, book a consultation, and file your case directly.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => navigate('/find-lawyer')} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                    Find a Lawyer <ChevronRight size={18} />
                  </button>
                  <span style={{ color: 'var(--text-muted)' }}>Step 1 of 3</span>
                </div>
              </div>
            </div>
          )}

          {cases.length > 0 && (
             <div style={{ display: 'flex', gap: '16px' }}>
               <button onClick={() => navigate('/find-lawyer')} className="btn btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <UserPlus size={18} /> Hire Another Lawyer
               </button>
               <button onClick={() => navigate('/ai-legal-assistant')} className="btn btn-outline" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Bot size={18} /> Ask AI Assistant
               </button>
             </div>
          )}
        </div>
      </div>

      {/* NEW: LIVE ACTION HUB for INSTANT LEGAL ADVICE */}
      <div className="dashboard-panel live-hub-panel" style={{ marginTop: '0px', marginBottom: '32px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(15, 23, 42, 0.8))' }}>
        <div className="panel-header" style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <h2 style={{ color: '#34d399' }}><Shield size={20} /> Live Action Hub</h2>
          <span className="live-pulse-indicator" style={{ border: 'none', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            <div className="lpi-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulseRecording 1s infinite alternate' }}></div> 
            Systems Online
          </span>
        </div>
        <div className="panel-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="action-card-premium" onClick={() => navigate('/find-lawyer')} style={{ cursor: 'pointer', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '24px', borderRadius: '16px', transition: 'all 0.3s' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Headphones size={24} />
            </div>
            <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.2rem' }}>Get Instant Legal Advice</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>Connect with a verified Duty Lawyer immediately. Available 24/7 across India.</p>
            <div style={{ color: '#60a5fa', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>CONNECT NOW <ChevronRight size={16}/></div>
          </div>

          <div className="action-card-premium" onClick={() => navigate('/ai-legal-assistant')} style={{ cursor: 'pointer', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px', borderRadius: '16px', transition: 'all 0.3s' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.2rem' }}>AI Case Analyzer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>Upload legal notices or FIRs. Our AI will break down your exact legal standing.</p>
            <div style={{ color: '#a78bfa', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>START ANALYSIS <ChevronRight size={16}/></div>
          </div>

          <div className="action-card-premium" onClick={() => navigate('/citizen-dashboard/document-generator')} style={{ cursor: 'pointer', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px', transition: 'all 0.3s' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.2)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileSignature size={24} />
            </div>
            <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.2rem' }}>Rapid Document Generator</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>Auto-generate court-ready Affidavits, Custom Notices, and Petitions in 60 seconds.</p>
            <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>GENERATE DOCS <ChevronRight size={16}/></div>
          </div>

        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '0px' }}>
        <div className="stat-card">
          <div className="stat-icon warning">
            <Clock size={28} />
          </div>
          <div className="stat-details">
            <h3>Active Cases</h3>
            <p>{loading ? '...' : activeCasesCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">
            <Calendar size={28} />
          </div>
          <div className="stat-details">
            <h3>Upcoming Consultations</h3>
            <p>{loading ? '...' : upcomingCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <FileText size={28} />
          </div>
          <div className="stat-details">
            <h3>Saved Documents</h3>
            <p>{loading ? '...' : 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        
        {/* NEW UPCOMING CONSULTATIONS PANEL */}
        <div className="dashboard-panel" style={{ marginBottom: '24px' }}>
          <div className="panel-header">
            <h2><Calendar size={20} /> Upcoming Consultations</h2>
            <Link to="/citizen-dashboard/consultations" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View All</Link>
          </div>
          <div className="panel-content">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading appointments...</p>
            ) : consultations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You have no scheduled consultations. Book an expert from the Find Lawyer page.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lawyer</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Meeting Link</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.slice(0, 3).map((c) => (
                     <tr key={c.id}>
                       <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         {c.Lawyer?.profileImage ? (
                           <img src={c.Lawyer.profileImage} alt={c.Lawyer.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                         ) : (
                           <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                             {c.Lawyer?.name?.charAt(0) || 'L'}
                           </div>
                         )}
                         {c.Lawyer?.name || 'Unknown'}
                       </td>
                       <td style={{ whiteSpace: 'nowrap' }}>{new Date(c.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                       <td>
                         <span className={`status-badge ${c.status === 'approved' ? 'active' : c.status === 'pending' ? 'pending' : 'closed'}`}>
                           {c.status}
                         </span>
                       </td>
                       <td>
                        {c.meetingLink ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Join</a>
                            <button className="btn btn-outline" style={{ padding: '4px 6px', fontSize: '0.7rem' }} onClick={() => setConsultations(prev => prev.map(item => item.id === c.id ? { ...item, meetingLink: null } : item))}>Edit</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input 
                              type="url" 
                              placeholder="Set link" 
                              value={links[c.id] || ''}
                              onChange={(e) => setLinks({ ...links, [c.id]: e.target.value })}
                              style={{ padding: '4px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', width: '100px', fontSize: '0.8rem' }}
                            />
                            <button 
                              onClick={() => handleSaveLink(c.id)} 
                              className="btn btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              disabled={saving === c.id || !links[c.id]}
                            >
                              {saving === c.id ? '...' : 'Save'}
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

        <div className="dashboard-panel" style={{ marginBottom: '24px' }}>
          <div className="panel-header">
            <h2><FileText size={20} /> Recent Cases</h2>
            <Link to="/citizen-dashboard/cases" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View All</Link>
          </div>
          <div className="panel-content">
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading cases...</p>
            ) : cases.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You have no registered cases yet. Start by finding a lawyer above.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Next Date</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.slice(0, 5).map((c) => (
                     <tr key={c.id}>
                       <td>{c.caseNumber || `CASE-${c.id}`}</td>
                       <td>{c.title}</td>
                       <td>
                         <span className={`status-badge ${c.status?.toLowerCase() === 'active' ? 'active' : c.status?.toLowerCase() === 'pending' ? 'pending' : 'closed'}`}>
                           {c.status || 'Pending'}
                         </span>
                       </td>
                       <td>{c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString() : 'TBA'}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2><Search size={20} /> Quick Links</h2>
          </div>
          <div className="panel-content" style={{ padding: '16px' }}>
            <div className="action-list">
              <Link to="/case-tracking" className="action-item">
                <div className="action-icon">
                  <Clock size={24} />
                </div>
                <div className="action-text">
                  <h4>Track Case Status</h4>
                  <p>Check updates via CVR</p>
                </div>
              </Link>
              <Link to="/citizen-dashboard/documents" className="action-item">
                <div className="action-icon">
                  <FileText size={24} />
                </div>
                <div className="action-text">
                  <h4>Document Locker</h4>
                  <p>Access your securely saved files</p>
                </div>
              </Link>
              <Link to="/citizen-dashboard/document-generator" className="action-item">
                <div className="action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  <FileSignature size={24} />
                </div>
                <div className="action-text">
                  <h4>Document Generator</h4>
                  <p>Create FIR, Affidavit & more</p>
                </div>
              </Link>
              <Link to="/citizen-dashboard/compensation-calculator" className="action-item">
                <div className="action-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Calculator size={24} />
                </div>
                <div className="action-text">
                  <h4>Compensation Calculator</h4>
                  <p>Estimate accident claims easily</p>
                </div>
              </Link>
              <Link to="/citizen-dashboard/voice-fir" className="action-item">
                <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Mic size={24} />
                </div>
                <div className="action-text">
                  <h4>AI Voice FIR</h4>
                  <p>Speak & Generate legal FIRs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CitizenLayout = () => {
  const citizenLinks = [
    { label: 'Dashboard', path: '/citizen-dashboard', icon: <Search size={20} /> },
    { label: 'My Cases', path: '/citizen-dashboard/cases', icon: <FileText size={20} /> },
    { label: 'Consultations', path: '/citizen-dashboard/consultations', icon: <Calendar size={20} /> },
    { label: 'Documents', path: '/citizen-dashboard/documents', icon: <FileText size={20} /> },
    { label: 'Doc Generator', path: '/citizen-dashboard/document-generator', icon: <FileText size={20} /> },
    { label: 'Calculator', path: '/citizen-dashboard/compensation-calculator', icon: <Scale size={20} /> },
    { label: 'Voice FIR', path: '/citizen-dashboard/voice-fir', icon: <Mic size={20} /> },
    { label: 'Transcription', path: '/citizen-dashboard/hearing-transcription', icon: <Headphones size={20} /> },
    { label: 'Notifications', path: '/citizen-dashboard/notifications', icon: <Bell size={20} /> },
    { label: 'Settings', path: '/citizen-dashboard/settings', icon: <Settings size={20} /> },
  ];
  return <DashboardLayout role="citizen" links={citizenLinks} />;
};
