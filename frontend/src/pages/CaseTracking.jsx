import { useState } from 'react';
import { Search, CheckCircle, Clock } from 'lucide-react';
import api from '../api';
import './Features.css';

const CaseTracking = () => {
  const [cvrInput, setCvrInput] = useState('');
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cvrInput.trim()) return;
    
    setError('');
    setLoading(true);

    try {
      const data = await api.trackCase(cvrInput);
      setCaseDetails(data);
    } catch (err) {
      setError(err.message || 'Case not found');
      setCaseDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="case-tracking-page section animate-fade-in">
      <div className="container">
        <div className="section-title">
          <h1 className="heading-2">Track Your Case</h1>
          <p className="text-lead">Enter your CVR number to get real-time updates on your case status.</p>
        </div>
        
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div className="tracking-form-container">
            <h3 className="heading-3 mb-8">Case Verification Record (CVR)</h3>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-with-icon">
                <Search className="input-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="e.g. CVR-2024-MH-12345" 
                  value={cvrInput}
                  onChange={(e) => setCvrInput(e.target.value)}
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Clock size={20} className="spin-animation" /> Tracking...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Search size={20} /> {caseDetails ? 'Check Status' : 'Search Case'}
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            {error && <div style={{ marginTop: '16px', color: '#ef4444' }}>{error}</div>}
          </div>
        </div>

        {caseDetails && (
          <div className="case-results card animate-fade-in" style={{ maxWidth: '800px', margin: '40px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h3 className="heading-3">{caseDetails.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>CVR Number: <strong>{caseDetails.cvrNumber}</strong></p>
              </div>
              <span className={`status-badge ${caseDetails.status.toLowerCase()}`}>
                {caseDetails.status}
              </span>
            </div>

            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-icon"><CheckCircle size={20} /></div>
                <div className="timeline-content">
                  <h4>Case Filed in {caseDetails.court}</h4>
                  <p className="description">{caseDetails.description}</p>
                </div>
              </div>
              
              <div className="timeline-item pending">
                <div className="timeline-icon"><Clock size={20} /></div>
                <div className="timeline-content">
                  <h4>Next Hearing Date</h4>
                  <p className="description">Scheduled for: {new Date(caseDetails.nextHearingDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseTracking;
