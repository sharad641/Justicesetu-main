import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Star, TrendingUp, BarChart3, CheckCircle, XCircle, Clock,
  Award, Shield, MapPin, Briefcase, ArrowLeft, ThumbsUp,
  Scale, FileText, Calendar, ChevronRight, Percent
} from 'lucide-react';
import './LawyerAnalytics.css';

// ─── Mock Data Generator (per lawyer ID) ───
function generateAnalyticsData(lawyer) {
  const seed = (lawyer?.id || 1) * 7;
  const r = (min, max) => min + ((seed * 13 + max) % (max - min + 1));

  const totalCases = r(30, 180);
  const won = Math.round(totalCases * (0.6 + (seed % 30) / 100));
  const lost = Math.round(totalCases * (0.08 + (seed % 10) / 100));
  const settled = Math.round(totalCases * (0.15 + (seed % 8) / 100));
  const pending = totalCases - won - lost - settled;

  const caseTypes = [
    { type: lawyer?.specialization || 'General', count: Math.round(totalCases * 0.45), color: '#3b82f6' },
    { type: 'Civil Disputes', count: Math.round(totalCases * 0.2), color: '#10b981' },
    { type: 'Consumer Cases', count: Math.round(totalCases * 0.15), color: '#f59e0b' },
    { type: 'Other', count: Math.round(totalCases * 0.2), color: '#8b5cf6' },
  ];

  const caseHistory = [
    { id: 1, title: `${lawyer?.specialization || 'Civil'} Matter — ${lawyer?.location || 'Delhi'} HC`, status: 'Won', date: '2026-02', court: 'High Court', duration: '14 months' },
    { id: 2, title: 'Consumer Complaint — District Forum', status: 'Won', date: '2025-11', court: 'District Court', duration: '6 months' },
    { id: 3, title: 'Property Dispute Resolution', status: 'Settled', date: '2025-08', court: 'Mediation Centre', duration: '3 months' },
    { id: 4, title: 'Insurance Claim Recovery', status: 'Won', date: '2025-05', court: 'Consumer Commission', duration: '8 months' },
    { id: 5, title: 'Bail Application — Sessions Court', status: 'Won', date: '2025-02', court: 'Sessions Court', duration: '2 weeks' },
    { id: 6, title: `Contractual Breach — Arbitration`, status: 'Pending', date: '2026-01', court: 'Arbitration Tribunal', duration: 'Ongoing' },
    { id: 7, title: 'Domestic Violence Protection', status: 'Won', date: '2024-10', court: 'Family Court', duration: '4 months' },
    { id: 8, title: 'Land Revenue Dispute', status: 'Lost', date: '2024-06', court: 'Revenue Court', duration: '18 months' },
  ];

  const reviews = [
    { id: 1, name: 'Priya M.', rating: 5, date: 'Feb 2026', text: 'Outstanding advocacy. Won our property dispute case that nobody else would take. Extremely thorough preparation and commanding presence in court.', avatar: 'P', verified: true },
    { id: 2, name: 'Rajesh K.', rating: 5, date: 'Jan 2026', text: `Best ${lawyer?.specialization || 'legal'} expert in ${lawyer?.location || 'the city'}. Professional communication throughout the entire process. Worth every rupee.`, avatar: 'R', verified: true },
    { id: 3, name: 'Anonymous', rating: 4, date: 'Dec 2025', text: 'Very knowledgeable and always available. The only reason for 4 stars is the slight delay in document preparation, but the end result was perfect.', avatar: 'A', verified: true },
    { id: 4, name: 'Sneha D.', rating: 5, date: 'Nov 2025', text: 'Filed my consumer complaint and got full refund within 3 months! Quick, efficient, and extremely supportive. Highly recommend to everyone.', avatar: 'S', verified: false },
    { id: 5, name: 'Amit S.', rating: 4, date: 'Sep 2025', text: 'Good expertise in handling complex matters. Represented me well in arbitration. Could improve on response time but overall very satisfied.', avatar: 'A', verified: true },
    { id: 6, name: 'Kavita R.', rating: 5, date: 'Aug 2025', text: 'Handled my bail application swiftly and got relief in the first hearing itself. Truly well-connected and brilliant in court strategy.', avatar: 'K', verified: true },
  ];

  const ratingBreakdown = [
    { stars: 5, count: Math.round((lawyer?.reviews || 40) * 0.60) },
    { stars: 4, count: Math.round((lawyer?.reviews || 40) * 0.22) },
    { stars: 3, count: Math.round((lawyer?.reviews || 40) * 0.10) },
    { stars: 2, count: Math.round((lawyer?.reviews || 40) * 0.05) },
    { stars: 1, count: Math.round((lawyer?.reviews || 40) * 0.03) },
  ];

  return { totalCases, won, lost, settled, pending, caseTypes, caseHistory, reviews, ratingBreakdown, successRate: Math.round((won / totalCases) * 100) };
}

// ─── SVG Donut Chart ───
const DonutChart = ({ segments, size = 160 }) => {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart">
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.value / total : 0;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotation = (offset / total) * 360 - 90;
        offset += seg.value;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            style={{ transition: 'all 0.8s ease' }}
          />
        );
      })}
    </svg>
  );
};

// ─── Rating Bar ───
const RatingBar = ({ stars, count, maxCount }) => (
  <div className="rating-bar-row">
    <span className="rb-stars">{stars} <Star size={12} fill="#f59e0b" color="#f59e0b" /></span>
    <div className="rb-track">
      <div className="rb-fill" style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }} />
    </div>
    <span className="rb-count">{count}</span>
  </div>
);

const LawyerAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lawyer = location.state?.lawyer;
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!lawyer) {
    return (
      <div className="la-error">
        <Shield size={48} />
        <h2>No Lawyer Selected</h2>
        <p>Please go back to the directory and select a lawyer.</p>
        <button className="la-btn-primary" onClick={() => navigate('/find-lawyer')}>Back to Directory</button>
      </div>
    );
  }

  const data = useMemo(() => generateAnalyticsData(lawyer), [lawyer]);
  const maxReviewCount = Math.max(...data.ratingBreakdown.map(r => r.count));

  const donutSegments = [
    { value: data.won, color: '#10b981', label: 'Won' },
    { value: data.settled, color: '#f59e0b', label: 'Settled' },
    { value: data.pending, color: '#3b82f6', label: 'Pending' },
    { value: data.lost, color: '#ef4444', label: 'Lost' },
  ];

  const statusIcon = { Won: <CheckCircle size={14} />, Lost: <XCircle size={14} />, Settled: <Scale size={14} />, Pending: <Clock size={14} /> };
  const statusClass = { Won: 'won', Lost: 'lost', Settled: 'settled', Pending: 'pending' };

  return (
    <div className="la-page">
      {/* Breadcrumb */}
      <div className="la-breadcrumb">
        <Link to="/find-lawyer"><ArrowLeft size={16} /> Directory</Link>
        <ChevronRight size={14} />
        <span>{lawyer.name}</span>
        <ChevronRight size={14} />
        <span className="active">Analytics</span>
      </div>

      {/* Lawyer Card Header */}
      <div className="la-hero-card">
        <img src={lawyer.image} alt={lawyer.name} className="la-avatar" />
        <div className="la-hero-info">
          <div className="la-hero-row">
            <h1>{lawyer.name}</h1>
            {lawyer.isVerified && <span className="la-badge verified"><Shield size={14} /> Verified</span>}
            {data.successRate >= 80 && <span className="la-badge gold"><Award size={14} /> {data.successRate}% Success</span>}
          </div>
          <p className="la-hero-sub">{lawyer.specialization} &bull; {lawyer.location} &bull; {lawyer.experience} Experience</p>
          <div className="la-hero-stats">
            <div className="la-stat"><Star size={16} fill="#f59e0b" color="#f59e0b" /> <strong>{lawyer.rating}</strong> ({lawyer.reviews} reviews)</div>
            <div className="la-stat"><BarChart3 size={16} /> <strong>{data.totalCases}</strong> cases handled</div>
            <div className="la-stat"><TrendingUp size={16} /> <strong>{data.successRate}%</strong> win rate</div>
          </div>
        </div>
        <div className="la-hero-actions">
          <button className="la-btn-secondary" onClick={() => navigate(`/lawyer-profile/${lawyer.id}`, { state: { lawyer } })}>View Profile</button>
          <button className="la-btn-primary" onClick={() => navigate('/consultation-booking', { state: { selectedLawyer: lawyer.raw || lawyer } })}>Book Consultation</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="la-tabs">
        {['overview', 'cases', 'reviews'].map(tab => (
          <button key={tab} className={`la-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' && <><BarChart3 size={16} /> Overview</>}
            {tab === 'cases' && <><FileText size={16} /> Case History</>}
            {tab === 'reviews' && <><Star size={16} /> Reviews</>}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="la-content animate-fade-in">
          {/* Stats Row */}
          <div className="la-stats-grid">
            <div className="la-stat-card green">
              <div className="stat-icon"><CheckCircle size={22} /></div>
              <div className="stat-num">{data.won}</div>
              <div className="stat-label">Cases Won</div>
            </div>
            <div className="la-stat-card yellow">
              <div className="stat-icon"><Scale size={22} /></div>
              <div className="stat-num">{data.settled}</div>
              <div className="stat-label">Settled</div>
            </div>
            <div className="la-stat-card blue">
              <div className="stat-icon"><Clock size={22} /></div>
              <div className="stat-num">{data.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="la-stat-card red">
              <div className="stat-icon"><XCircle size={22} /></div>
              <div className="stat-num">{data.lost}</div>
              <div className="stat-label">Lost</div>
            </div>
          </div>

          <div className="la-charts-row">
            {/* Success Rate Donut */}
            <div className="la-chart-card">
              <h3>Case Outcomes</h3>
              <div className="donut-wrapper">
                <DonutChart segments={donutSegments} size={180} />
                <div className="donut-center">
                  <span className="donut-pct">{data.successRate}%</span>
                  <span className="donut-sub">Win Rate</span>
                </div>
              </div>
              <div className="donut-legend">
                {donutSegments.map(s => (
                  <div key={s.label} className="legend-item">
                    <span className="legend-dot" style={{ background: s.color }} />
                    {s.label}: {s.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Case Type Breakdown */}
            <div className="la-chart-card">
              <h3>Practice Area Distribution</h3>
              <div className="bar-chart">
                {data.caseTypes.map(ct => (
                  <div key={ct.type} className="bar-row">
                    <span className="bar-label">{ct.type}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(ct.count / data.totalCases) * 100}%`, background: ct.color }} />
                    </div>
                    <span className="bar-val">{ct.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="la-chart-card">
              <h3>Client Ratings</h3>
              <div className="rating-summary-mini">
                <div className="rs-big">{lawyer.rating}</div>
                <div className="rs-stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= Math.floor(lawyer.rating) ? '#f59e0b' : 'transparent'} color="#f59e0b" />)}
                </div>
                <p>{lawyer.reviews} total reviews</p>
              </div>
              <div className="rating-bars">
                {data.ratingBreakdown.map(rb => (
                  <RatingBar key={rb.stars} stars={rb.stars} count={rb.count} maxCount={maxReviewCount} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CASES TAB ─── */}
      {activeTab === 'cases' && (
        <div className="la-content animate-fade-in">
          <div className="la-timeline">
            {data.caseHistory.map(c => (
              <div key={c.id} className={`timeline-item ${statusClass[c.status]}`}>
                <div className="tl-dot">{statusIcon[c.status]}</div>
                <div className="tl-card">
                  <div className="tl-header">
                    <h4>{c.title}</h4>
                    <span className={`tl-status ${statusClass[c.status]}`}>{c.status}</span>
                  </div>
                  <div className="tl-meta">
                    <span><Calendar size={13} /> {c.date}</span>
                    <span><MapPin size={13} /> {c.court}</span>
                    <span><Clock size={13} /> {c.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── REVIEWS TAB ─── */}
      {activeTab === 'reviews' && (
        <div className="la-content animate-fade-in">
          <div className="la-reviews-header">
            <div className="rh-left">
              <div className="rh-score">{lawyer.rating}</div>
              <div>
                <div className="rh-stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= Math.floor(lawyer.rating) ? '#f59e0b' : 'transparent'} color="#f59e0b" />)}
                </div>
                <p>{lawyer.reviews} verified reviews</p>
              </div>
            </div>
            <div className="rating-bars compact">
              {data.ratingBreakdown.map(rb => (
                <RatingBar key={rb.stars} stars={rb.stars} count={rb.count} maxCount={maxReviewCount} />
              ))}
            </div>
          </div>

          <div className="la-reviews-list">
            {data.reviews.map(rev => (
              <div key={rev.id} className="la-review-card">
                <div className="rev-top">
                  <div className="rev-user">
                    <div className="rev-avatar">{rev.avatar}</div>
                    <div>
                      <strong>{rev.name}</strong>
                      {rev.verified && <span className="rev-verified"><CheckCircle size={12} /> Verified</span>}
                      <span className="rev-date">{rev.date}</span>
                    </div>
                  </div>
                  <div className="rev-rating">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= rev.rating ? '#f59e0b' : 'transparent'} color="#f59e0b" />)}
                  </div>
                </div>
                <p className="rev-text">{rev.text}</p>
                <div className="rev-actions">
                  <button><ThumbsUp size={14} /> Helpful</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerAnalytics;
