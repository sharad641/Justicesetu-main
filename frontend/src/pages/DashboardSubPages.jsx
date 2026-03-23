import { useState, useEffect } from 'react';
import { FileText, Calendar, Users, Shield } from 'lucide-react';
import api from '../api';
import DocumentVault from './DocumentVault';
import './DashboardStyles.css';

// A simple generic component for features under dashboard that aren't fully built out
export const GenericDashboardPage = ({ title, description }) => {
  return (
    <div className="dashboard-panel" style={{ minHeight: 'calc(100vh - 144px)' }}>
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{description}</p>
        <p style={{ maxWidth: '500px', textAlign: 'center' }}>This section has been successfully migrated to the React Router structure and is ready for further feature development.</p>
      </div>
    </div>
  );
};

export const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.getCases();
        setCases(data || []);
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="dashboard-panel" style={{ minHeight: 'calc(100vh - 144px)' }}>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2><FileText size={20} /> Case Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsAdding(!isAdding)}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          {isAdding ? 'Cancel' : '+ Add New Case'}
        </button>
      </div>
      <div className="panel-content">
        {isAdding && (
          <div className="card" style={{ marginBottom: '24px', background: 'rgba(15, 23, 42, 0.4)', border: '1px dashed rgba(59, 130, 246, 0.5)' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>File a New Case</h3>
            <form onSubmit={(e) => { e.preventDefault(); setIsAdding(false); }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Case Title</label>
                <input type="text" required placeholder="e.g. Property Dispute vs Builder" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Case Description</label>
                <textarea rows="3" required placeholder="Briefly describe the issue..." style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Case for Review</button>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your cases...</p>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '1.2rem' }}>You don't have any cases yet.</p>
            <p>Once you add a case, it will appear here for easy tracking.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Next Hearing</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '600' }}>{c.caseNumber || `CASE-${c.id}`}</td>
                  <td>{c.title}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.description}
                  </td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase() === 'active' ? 'active' : c.status?.toLowerCase() === 'pending' ? 'pending' : 'closed'}`}>
                      {c.status || 'Pending'}
                    </span>
                  </td>
                  <td>{c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString() : 'TBA'}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const ConsultationRequests = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await api.getMyConsultations();
        setConsultations(data || []);
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

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
    <div className="dashboard-panel" style={{ minHeight: 'calc(100vh - 144px)' }}>
      <div className="panel-header">
        <h2><Calendar size={20} /> Consultations & Schedule</h2>
      </div>
      <div className="panel-content">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading schedule...</p>
        ) : consultations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '1.2rem' }}>No consultations found.</p>
            <p>Your upcoming and past consultation bookings will appear here.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Service Type</th>
                <th>Counterparty</th>
                <th>Status</th>
                <th>Zoom Link</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '600' }}>{new Date(c.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{c.serviceType || 'General Consultation'}</td>
                  <td>{c.Citizen?.name || c.Lawyer?.name || 'Unknown'}</td>
                  <td>
                    <span className="status-badge pending">{c.status || 'Scheduled'}</span>
                  </td>
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
                          placeholder="Paste Zoom/Meet link" 
                          value={links[c.id] || ''}
                          onChange={(e) => setLinks({ ...links, [c.id]: e.target.value })}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', width: '200px' }}
                        />
                        <button 
                          onClick={() => handleSaveLink(c.id)} 
                          className="btn btn-primary" 
                          style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                          disabled={saving === c.id || !links[c.id]}
                        >
                          {saving === c.id ? 'Saving...' : 'Set Link'}
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
  );
};

export const Clients = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCons = async () => {
      try {
        const data = await api.getMyConsultations();
        setConsultations(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCons();
  }, []);

  // Extract unique clients
  const uniqueClientsMap = new Map();
  consultations.forEach(c => {
    if (c.citizen && !uniqueClientsMap.has(c.citizen.id)) {
      uniqueClientsMap.set(c.citizen.id, c.citizen);
    }
  });
  const clients = Array.from(uniqueClientsMap.values());

  return (
    <div className="dashboard-panel" style={{ minHeight: 'calc(100vh - 144px)' }}>
      <div className="panel-header">
        <h2><Users size={20} /> Client Roster</h2>
      </div>
      <div className="panel-content">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading clients...</p>
        ) : clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '1.2rem' }}>No clients yet.</p>
            <p>Once users book a consultation, they will be tracked here.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Last Interaction</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-glow)' }}>
                      {client.name.charAt(0)}
                    </div>
                    {client.name}
                  </td>
                  <td>{client.email || 'N/A'}</td>
                  <td>Recent</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const Documents = () => <DocumentVault />;
export const DocumentLocker = () => <GenericDashboardPage title="Encrypted Document Locker" description="Securely store and share private legal documents with your lawyer." />;
export { default as Profile } from './ProfileSettings';
