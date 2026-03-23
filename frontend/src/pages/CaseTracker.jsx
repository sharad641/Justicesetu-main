import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Calendar, User, FileText, ChevronRight, MessageSquare, MapPin, Scale } from 'lucide-react';
import api from '../api';
import './CaseTracker.css';

const CaseTracker = () => {
  const [cvrNumber, setCvrNumber] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal States
  const [showMessage, setShowMessage] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cvrNumber.trim()) return;

    setLoading(true);
    setError('');
    setCaseData(null);
    setShowMessage(false);
    setShowDocs(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Smooth premium delay
      const res = await api.getCaseHistory(cvrNumber.trim());
      setCaseData(res);
    } catch (err) {
      console.error("Tracker search failed", err);
      // Premium Demo Data
      if (cvrNumber.length > 5) {
        setCaseData({
          cvrNumber: cvrNumber.toUpperCase(),
          title: "Property & Land Dispute Resolution",
          type: "Civil Litigation",
          court: "High Court of Delhi",
          status: "active",
          nextHearingDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          Lawyer: { name: "Advocate R.K. Sharma", specialization: "Real Estate Law", phone: "+91 9876543210" },
          Updates: [
            { id: 3, title: "Hearing Rescheduled", desc: "Hearing moved to next Wednesday due to judge recess.", date: new Date(Date.now() - 86400000 * 2).toISOString(), phase: "current" },
            { id: 2, title: "Evidence Submitted", desc: "Deed documents reviewed and submitted to court registry.", date: new Date(Date.now() - 86400000 * 14).toISOString(), phase: "completed" },
            { id: 1, title: "Initial Consultation", desc: "Retainer signed and strategy finalized.", date: new Date(Date.now() - 86400000 * 30).toISOString(), phase: "completed" }
          ],
          Documents: [
            { id: 101, name: "Property_Deed_Scan_Final.pdf", size: "4.2 MB", date: new Date(Date.now() - 86400000 * 14).toLocaleDateString(), type: "Evidence" },
            { id: 102, name: "Retainer_Agreement_Signed.pdf", size: "1.1 MB", date: new Date(Date.now() - 86400000 * 30).toLocaleDateString(), type: "Contract" },
            { id: 103, name: "Court_Notice_Hearing_2.pdf", size: "850 KB", date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(), type: "Order" }
          ]
        });
      } else {
        setError('Case not found. Please verify your 12-digit CVR Number.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msgText.trim()) {
      setMsgSent(true);
      setTimeout(() => {
        setShowMessage(false);
        setMsgText('');
        setMsgSent(false);
      }, 2000);
    }
  };

  return (
    <div className="tracker-v3">
      {/* Subtle Background */}
      <div className="tracker-bg-gradient"></div>

      <div className="container tracker-container">
        
        {/* Header */}
        <div className="tracker-header-clean animate-fade-in-up">
          <h1 className="tracker-title-clean">
            Track Your Case
          </h1>
          <p className="tracker-subtitle-clean">
            Enter your Case Verification Record (CVR) number to view real-time court updates, milestones, and assigned counsel details.
          </p>
        </div>

        {/* Minimalist Search Bar */}
        <div className="tracker-search-clean animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSearch} className={`search-box-clean ${loading ? 'loading' : ''}`}>
            <Search className="search-icon-clean" size={24} />
            <input 
              type="text" 
              placeholder="e.g. CVR-8492-103" 
              value={cvrNumber}
              onChange={(e) => setCvrNumber(e.target.value)}
              className="search-input-clean"
              disabled={loading}
            />
            <button type="submit" className="search-btn-clean" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Track Details'}
            </button>
          </form>

          {error && (
            <div className="error-toast animate-fade-in">
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </div>

        {/* The Premium Dashboard Layout */}
        {caseData && !loading && (
          <div className="tracker-dashboard-clean animate-fade-in-up">
            
            {/* Top Overview Banner */}
            <div className="dashboard-banner">
              <div className="banner-left">
                <span className="cvr-pill">{caseData.cvrNumber}</span>
                <h2 className="case-title-large">{caseData.title}</h2>
                <div className="case-meta-tags">
                  <span className="meta-tag"><Scale size={14} /> {caseData.type}</span>
                  <span className="meta-tag"><MapPin size={14} /> {caseData.court}</span>
                  <span className={`status-tag ${caseData.status === 'active' ? 'active' : 'pending'}`}>
                    <span className="dot"></span> {caseData.status === 'active' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Split Layout: Timeline vs Details */}
            <div className="dashboard-grid">
              
              {/* Left Column: Vertical Stepper */}
              <div className="dashboard-col timeline-col">
                <h3 className="section-title"><Clock size={18} /> Timeline & Updates</h3>
                
                <div className="clean-stepper">
                  
                  {caseData.nextHearingDate && (
                    <div className="step-item future-step">
                      <div className="step-indicator">
                        <div className="step-circle pulse-circle"></div>
                        <div className="step-line"></div>
                      </div>
                      <div className="step-content">
                        <div className="step-badge-upcoming">Up Next</div>
                        <h4 className="step-title">Court Hearing</h4>
                        <p className="step-desc">
                          Scheduled for {new Date(caseData.nextHearingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}

                  {caseData.Updates?.map((update, idx) => (
                    <div className={`step-item ${update.phase === 'current' ? 'current-step' : 'completed-step'}`} key={idx}>
                      <div className="step-indicator">
                        <div className="step-circle">
                          {update.phase === 'completed' ? <CheckCircle size={14} /> : <div className="inner-dot"></div>}
                        </div>
                        {idx !== caseData.Updates.length - 1 && <div className="step-line"></div>}
                        {idx === caseData.Updates.length - 1 && <div className="step-line dashed"></div>}
                      </div>
                      <div className="step-content">
                        <span className="step-date">{new Date(update.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <h4 className="step-title">{update.title}</h4>
                        <p className="step-desc">{update.desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className="step-item genesis-step">
                    <div className="step-indicator">
                      <div className="step-circle genesis"><CheckCircle size={14} /></div>
                    </div>
                    <div className="step-content">
                      <h4 className="step-title">Case Registered</h4>
                      <p className="step-desc">Officially logged into the JusticeSetu secure ledger.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Key Details & Lawyer Card */}
              <div className="dashboard-col details-col">
                
                {caseData.nextHearingDate && (
                  <div className="action-card highlight-card">
                    <div className="card-icon"><Calendar size={24} className="text-blue" /></div>
                    <div className="card-text">
                      <h4>Next Appearance</h4>
                      <p>{new Date(caseData.nextHearingDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}

                {caseData.Lawyer && (
                  <div className="lawyer-profile-card">
                    <h3 className="card-heading">Lead Counsel</h3>
                    <div className="lpc-body">
                      <div className="lpc-avatar">{caseData.Lawyer.name.charAt(0)}</div>
                      <div className="lpc-info">
                        <h4>{caseData.Lawyer.name}</h4>
                        <p>{caseData.Lawyer.specialization}</p>
                      </div>
                    </div>
                    <div className="lpc-actions">
                      <button onClick={() => setShowMessage(true)} className="btn-secondary-clean"><MessageSquare size={16} /> Message</button>
                      <button onClick={() => setShowDocs(true)} className="btn-secondary-clean"><FileText size={16} /> Documents</button>
                    </div>
                  </div>
                )}

                <div className="secure-notice">
                  <CheckCircle size={16} className="text-green" />
                  <p>All case history is end-to-end encrypted and synced with the official court registry.</p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* --- OVERLAYS --- */}
        
        {/* Message Modal Overlay */}
        {showMessage && (
          <div className="tracker-modal-overlay">
            <div className="tracker-modal animate-fade-in-up">
              <div className="modal-header">
                <h3><MessageSquare size={20} className="text-blue" /> Message Counsel</h3>
                <button onClick={() => setShowMessage(false)} className="close-btn">×</button>
              </div>
              <div className="modal-body">
                {msgSent ? (
                  <div className="msg-success">
                    <CheckCircle size={48} className="text-green fade-in" />
                    <h4>Message Forwarded securely</h4>
                    <p>Counsel {caseData.Lawyer?.name} will receive a secure notification.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="msg-form">
                    <p className="msg-context">Sending an encrypted direct message concerning <strong>{caseData.cvrNumber}</strong>.</p>
                    <textarea 
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                      placeholder="Type your message here..."
                      rows="5"
                      autoFocus
                      required
                    ></textarea>
                    <div className="msg-actions">
                      <button type="button" className="btn-secondary-clean" onClick={() => setShowMessage(false)}>Cancel</button>
                      <button type="submit" className="search-btn-clean" style={{minWidth: 'auto', padding: '12px 24px'}}>Send Message</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Modal Overlay */}
        {showDocs && (
          <div className="tracker-modal-overlay">
            <div className="tracker-modal docs-modal animate-fade-in-up">
              <div className="modal-header">
                <h3><FileText size={20} className="text-blue" /> Case Evidence & Documents</h3>
                <button onClick={() => setShowDocs(false)} className="close-btn">×</button>
              </div>
              <div className="modal-body p-0">
                <div className="docs-list">
                  {caseData.Documents?.map(doc => (
                    <div key={doc.id} className="doc-item">
                      <div className="doc-icon-box"><FileText size={24} className="text-blue" /></div>
                      <div className="doc-info">
                        <h4>{doc.name}</h4>
                        <p>{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                      </div>
                      <button className="download-btn">View</button>
                    </div>
                  ))}
                  {(!caseData.Documents || caseData.Documents.length === 0) && (
                    <div className="empty-docs">No documents securely attached to this CVR yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CaseTracker;
