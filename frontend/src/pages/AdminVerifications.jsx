import { useState, useEffect } from 'react';
import { Shield, UserCheck, UserX, CheckCircle, RefreshCw, Mail, Calendar } from 'lucide-react';
import api from '../api';
import './DashboardStyles.css';

const AdminVerifications = () => {
  const [pendingQueue, setPendingQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await api.getPendingLawyers();
      setPendingQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load pending lawyers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (lawyerId) => {
    try {
      await api.verifyLawyer(lawyerId);
      setPendingQueue(prev => prev.filter(l => l.id !== lawyerId));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to verify lawyer.");
    }
  };

  const handleReject = (lawyerId) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      setPendingQueue(prev => prev.filter(l => l.id !== lawyerId));
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Shield size={24} style={{ color: '#f59e0b' }} /> Lawyer Verifications
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{pendingQueue.length} applications pending review</p>
        </div>
        <button onClick={fetchPending} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} style={{ margin: '0 auto 16px', opacity: 0.3, animation: 'spin 1s linear infinite' }} />
            <p>Loading verification queue...</p>
          </div>
        ) : pendingQueue.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 24px', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '1.4rem' }}>All Clear!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
              Every lawyer application has been reviewed. No pending verifications at this time.
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {pendingQueue.map((lawyer) => (
              <div key={lawyer.id} style={{
                display: 'flex', alignItems: 'center', gap: '20px', padding: '24px',
                margin: '8px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
              >
                {/* Avatar */}
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: '800', fontSize: '1.4rem', flexShrink: 0 }}>
                  {lawyer.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ color: 'var(--text-main)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{lawyer.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 12px', borderRadius: '12px', fontWeight: '600' }}>Pending Review</span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {lawyer.email}</span>
                    <span style={{ fontFamily: 'monospace', color: '#6366f1' }}>Bar: {lawyer.barCouncilId || 'Not Provided'}</span>
                    <span>{lawyer.specialization || 'General Law'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(lawyer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button onClick={() => handleApprove(lawyer.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px',
                    border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10b981',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.15)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <UserCheck size={18} /> Approve
                  </button>
                  <button onClick={() => handleReject(lawyer.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px',
                    border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  >
                    <UserX size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminVerifications;
