import { useState } from 'react';
import { FileText, Server, Database, Shield, Clock, CheckCircle, AlertTriangle, Activity, Cpu, HardDrive, Wifi } from 'lucide-react';
import './DashboardStyles.css';

const AdminLogs = () => {
  const [activeLogTab, setActiveLogTab] = useState('system');

  // Mock system logs for demonstration
  const systemLogs = [
    { level: 'info', message: 'Server started successfully on port 5000', timestamp: new Date(Date.now() - 60000).toLocaleString(), source: 'Express' },
    { level: 'info', message: 'PostgreSQL database synced with alter: true', timestamp: new Date(Date.now() - 120000).toLocaleString(), source: 'Sequelize' },
    { level: 'info', message: 'JWT Authentication middleware loaded', timestamp: new Date(Date.now() - 180000).toLocaleString(), source: 'Auth' },
    { level: 'warn', message: 'Rate limiter threshold approaching for /api/auth/login', timestamp: new Date(Date.now() - 300000).toLocaleString(), source: 'Security' },
    { level: 'info', message: 'Document upload route initialized', timestamp: new Date(Date.now() - 400000).toLocaleString(), source: 'Routes' },
    { level: 'info', message: 'Case Tracker module online', timestamp: new Date(Date.now() - 500000).toLocaleString(), source: 'Tracker' },
    { level: 'info', message: 'Admin controller endpoints registered', timestamp: new Date(Date.now() - 600000).toLocaleString(), source: 'Admin' },
    { level: 'warn', message: 'Deprecated API usage detected on /api/users', timestamp: new Date(Date.now() - 900000).toLocaleString(), source: 'Deprecation' },
  ];

  const securityLogs = [
    { level: 'info', message: 'Admin login from 192.168.1.1', timestamp: new Date(Date.now() - 60000).toLocaleString(), source: 'Auth' },
    { level: 'info', message: 'Lawyer "Sharad" verified by Admin', timestamp: new Date(Date.now() - 3600000).toLocaleString(), source: 'Verification' },
    { level: 'warn', message: 'Failed login attempt: invalid credentials for user@test.com', timestamp: new Date(Date.now() - 7200000).toLocaleString(), source: 'Auth' },
    { level: 'info', message: 'New citizen registration: citizen@example.com', timestamp: new Date(Date.now() - 7800000).toLocaleString(), source: 'Registration' },
    { level: 'info', message: 'JWT token refreshed for session #a8f21b', timestamp: new Date(Date.now() - 14400000).toLocaleString(), source: 'Auth' },
  ];

  const currentLogs = activeLogTab === 'system' ? systemLogs : securityLogs;

  const levelStyles = {
    info: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <CheckCircle size={14} /> },
    warn: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <AlertTriangle size={14} /> },
    error: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <AlertTriangle size={14} /> },
  };

  // System Status data
  const systemStatus = [
    { label: 'API Server', status: 'Online', icon: <Server size={18} />, color: '#10b981' },
    { label: 'PostgreSQL DB', status: 'Connected', icon: <Database size={18} />, color: '#10b981' },
    { label: 'Auth Service', status: 'Active', icon: <Shield size={18} />, color: '#10b981' },
    { label: 'File Storage', status: 'Ready', icon: <HardDrive size={18} />, color: '#10b981' },
    { label: 'WebSocket', status: 'Standby', icon: <Wifi size={18} />, color: '#f59e0b' },
    { label: 'CPU Usage', status: '12%', icon: <Cpu size={18} />, color: '#3b82f6' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 4px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <FileText size={24} style={{ color: '#6366f1' }} /> System Logs & Health
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Monitor server health, security events, and platform diagnostics.</p>
      </div>

      {/* System Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {systemStatus.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)',
            padding: '20px', borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center',
          }}>
            <div style={{ color: s.color }}>{s.icon}</div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</span>
            <span style={{ color: s.color, fontWeight: '700', fontSize: '0.85rem', background: `${s.color}15`, padding: '3px 12px', borderRadius: '12px' }}>{s.status}</span>
          </div>
        ))}
      </div>

      {/* Logs Section */}
      <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'system', label: 'System Logs', icon: <Activity size={16} /> },
            { key: 'security', label: 'Security Logs', icon: <Shield size={16} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveLogTab(t.key)}
              style={{
                flex: 1, padding: '16px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.3s',
                background: activeLogTab === t.key ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: activeLogTab === t.key ? '#a5b4fc' : 'var(--text-muted)',
                borderBottom: activeLogTab === t.key ? '2px solid #6366f1' : '2px solid transparent',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Log Entries */}
        <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.85rem' }}>
          {currentLogs.map((log, index) => {
            const style = levelStyles[log.level] || levelStyles.info;
            return (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                transition: 'background 0.2s', borderLeft: `3px solid ${style.color}`,
              }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Level Badge */}
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: style.color, background: style.bg,
                  padding: '4px 12px', borderRadius: '8px', fontWeight: '600',
                  fontSize: '0.75rem', textTransform: 'uppercase', flexShrink: 0
                }}>
                  {style.icon} {log.level}
                </span>

                {/* Source */}
                <span style={{ color: '#6366f1', fontSize: '0.8rem', flexShrink: 0, minWidth: '80px' }}>[{log.source}]</span>

                {/* Message */}
                <span style={{ flex: 1, color: 'var(--text-main)' }}>{log.message}</span>

                {/* Timestamp */}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />{log.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
