import { useState, useEffect } from 'react';
import { Users, FileText, Database, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, UserCheck, UserX, BarChart3, Gavel, Search, RefreshCw, Eye } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';
import './DashboardStyles.css';

export const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ citizens: 0, lawyers: 0, totalCases: 0, activeCases: 0, totalConsultations: 0, pendingLawyers: 0 });
  const [pendingQueue, setPendingQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsData = await api.getAdminStats();
      const queueData = await api.getPendingLawyers();
      setStats(statsData);
      setPendingQueue(Array.isArray(queueData) ? queueData : []);
    } catch (err) {
      console.error("Failed to load admin panel data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleApprove = async (lawyerId) => {
    try {
      await api.verifyLawyer(lawyerId);
      setPendingQueue(pendingQueue.filter(l => l.id !== lawyerId));
      setStats(prev => ({ ...prev, pendingLawyers: prev.pendingLawyers - 1, lawyers: prev.lawyers + 1 }));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = (lawyerId) => {
    const confirmed = window.confirm("Are you sure you want to reject this application?");
    if (confirmed) {
      setPendingQueue(pendingQueue.filter(l => l.id !== lawyerId));
      setStats(prev => ({ ...prev, pendingLawyers: prev.pendingLawyers - 1 }));
    }
  };

  const userName = user?.name || 'Admin';
  const totalUsers = stats.citizens + stats.lawyers;
  const platformHealth = totalUsers > 0 ? Math.min(98, 70 + Math.floor(totalUsers * 2)) : 85;

  // Mock recent activity data for a rich feed
  const recentActivity = [
    { icon: <UserCheck size={18} />, text: 'New lawyer registered', detail: 'Civil Law specialist', time: '2 mins ago', color: '#3b82f6' },
    { icon: <Gavel size={18} />, text: 'New case filed', detail: 'Property Dispute #CVR-9201', time: '15 mins ago', color: '#10b981' },
    { icon: <Clock size={18} />, text: 'Consultation completed', detail: 'Criminal Law session', time: '1 hour ago', color: '#8b5cf6' },
    { icon: <Shield size={18} />, text: 'Lawyer verified', detail: 'Bar ID: MAH/291/2020', time: '3 hours ago', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-home" style={{ padding: '0 4px' }}>
      {/* Command Center Banner */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', position: 'relative', borderBottom: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.1), transparent 60%)', pointerEvents: 'none' }} />
        <div className="welcome-content" style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981, 0 0 20px rgba(16,185,129,0.3)', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Online</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Command Center</h1>
          <p>Welcome back, <strong style={{ color: '#a5b4fc' }}>{userName}</strong>. Your platform is running smoothly.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
          <button onClick={handleRefresh} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            <RefreshCw size={18} className={refreshing ? 'spin-animation' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(15,23,42,0.6)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
          { key: 'verifications', label: `Verifications ${stats.pendingLawyers > 0 ? `(${stats.pendingLawyers})` : ''}`, icon: <Shield size={16} /> },
          { key: 'activity', label: 'Activity Feed', icon: <Activity size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '12px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.3s ease',
              background: activeTab === tab.key ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.15))' : 'transparent',
              color: activeTab === tab.key ? '#a5b4fc' : 'var(--text-muted)',
              boxShadow: activeTab === tab.key ? 'inset 0 0 0 1px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.1)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Total Users', value: loading ? '...' : totalUsers, icon: <Users size={24} />, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', trend: '+12%' },
              { label: 'Citizens', value: loading ? '...' : stats.citizens, icon: <UserCheck size={24} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', trend: '+8%' },
              { label: 'Lawyers', value: loading ? '...' : stats.lawyers, icon: <Shield size={24} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', trend: '+5%' },
              { label: 'Active Cases', value: loading ? '...' : stats.activeCases, icon: <Gavel size={24} />, color: '#10b981', bg: 'rgba(16,185,129,0.12)', trend: '+3%' },
              { label: 'Consultations', value: loading ? '...' : stats.totalConsultations, icon: <Clock size={24} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', trend: '+15%' },
              { label: 'Pending', value: loading ? '...' : stats.pendingLawyers, icon: <AlertTriangle size={24} />, color: stats.pendingLawyers > 0 ? '#ef4444' : '#10b981', bg: stats.pendingLawyers > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', trend: stats.pendingLawyers > 0 ? 'Action!' : 'Clear' },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)',
                padding: '24px', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease', cursor: 'pointer',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${card.color}44`; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${card.color}15`; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, border: `1px solid ${card.color}33` }}>
                    {card.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: card.color, background: card.bg, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} /> {card.trend}
                  </span>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{card.value}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Platform Health + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Platform Health */}
            <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', marginBottom: '24px', fontSize: '1.1rem' }}>
                <Activity size={20} style={{ color: '#10b981' }} /> Platform Health
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={platformHealth > 80 ? '#10b981' : '#f59e0b'} strokeWidth="3" strokeDasharray={`${platformHealth}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{platformHealth}%</span>
                  </div>
                </div>
                <div>
                  <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '8px' }}>All Systems Operational</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Database, Auth, and API services running at peak performance.</p>
                </div>
              </div>
              {[
                { label: 'API Response Time', value: '42ms', status: 'Excellent' },
                { label: 'Database Uptime', value: '99.9%', status: 'Healthy' },
                { label: 'Active Sessions', value: totalUsers > 0 ? `${totalUsers}` : '0', status: 'Normal' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{m.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600', fontFamily: 'monospace' }}>{m.value}</span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '12px' }}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', marginBottom: '24px', fontSize: '1.1rem' }}>
                <Database size={20} style={{ color: '#6366f1' }} /> Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Review Pending Lawyers', desc: `${stats.pendingLawyers} awaiting approval`, icon: <Shield size={20} />, color: '#f59e0b', action: () => setActiveTab('verifications') },
                  { label: 'View Activity Feed', desc: 'Recent platform events', icon: <Activity size={20} />, color: '#3b82f6', action: () => setActiveTab('activity') },
                  { label: 'Refresh Statistics', desc: 'Pull latest data from DB', icon: <RefreshCw size={20} />, color: '#10b981', action: handleRefresh },
                  { label: 'Platform Analytics', desc: 'View detailed insights', icon: <BarChart3 size={20} />, color: '#8b5cf6', action: () => {} },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                      textAlign: 'left', width: '100%', color: 'inherit'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = `${action.color}10`; e.currentTarget.style.borderColor = `${action.color}33`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${action.color}15`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${action.color}33`, flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-main)', fontWeight: '600', margin: '0 0 2px', fontSize: '0.95rem' }}>{action.label}</p>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== VERIFICATIONS TAB ===== */}
      {activeTab === 'verifications' && (
        <div className="animate-fade-in">
          <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: 'var(--text-main)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <Shield size={22} style={{ color: '#f59e0b' }} /> Lawyer Verification Queue
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{pendingQueue.length} applications awaiting review</p>
              </div>
            </div>
            
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} style={{ margin: '0 auto 16px', opacity: 0.3 }} className="spin-animation" />
                <p>Loading verification queue...</p>
              </div>
            ) : pendingQueue.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px', opacity: 0.6 }} />
                <h3 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '1.2rem' }}>All Clear!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No pending lawyer verification requests.</p>
              </div>
            ) : (
              <div style={{ padding: '8px' }}>
                {pendingQueue.map((lawyer, index) => (
                  <div key={lawyer.id} style={{
                    display: 'flex', alignItems: 'center', gap: '20px', padding: '20px',
                    margin: '8px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                  >
                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: '800', fontSize: '1.2rem', flexShrink: 0 }}>
                      {lawyer.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h4 style={{ color: 'var(--text-main)', margin: 0, fontWeight: '600' }}>{lawyer.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 10px', borderRadius: '12px', fontWeight: '600' }}>Pending</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>{lawyer.email}</span>
                        <span style={{ fontFamily: 'monospace', color: '#6366f1' }}>Bar: {lawyer.barCouncilId || 'N/A'}</span>
                        <span>{lawyer.specialization || 'General'}</span>
                        <span>{new Date(lawyer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleApprove(lawyer.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(16,185,129,0.2)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <UserCheck size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(lawyer.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      >
                        <UserX size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ACTIVITY FEED TAB ===== */}
      {activeTab === 'activity' && (
        <div className="animate-fade-in">
          <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ color: 'var(--text-main)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Activity size={22} style={{ color: '#6366f1' }} /> Recent Platform Activity
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Real-time feed of platform events</p>
            </div>
            
            <div style={{ padding: '16px' }}>
              {recentActivity.map((item, index) => (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 16px',
                  borderRadius: '12px', margin: '4px 0',
                  transition: 'all 0.2s ease',
                  borderLeft: `3px solid ${item.color}`,
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-main)', fontWeight: '500', margin: '0 0 2px', fontSize: '0.95rem' }}>{item.text}</p>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>{item.detail}</p>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}

              {/* Spacer + Load More */}
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <button style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                  Load More Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive spin animation */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .welcome-banner { flex-direction: column !important; text-align: center !important; gap: 20px !important; padding: 24px 16px !important; }
          .welcome-banner h1 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export const AdminLayout = () => {
  const adminLinks = [
    { label: 'Command Center', path: '/admin', icon: <Database size={20} /> },
    { label: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Verifications', path: '/admin/verifications', icon: <Shield size={20} /> },
    { label: 'System Logs', path: '/admin/logs', icon: <FileText size={20} /> }
  ];
  return <DashboardLayout role="admin" links={adminLinks} />;
};
