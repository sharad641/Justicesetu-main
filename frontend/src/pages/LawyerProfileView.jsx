import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Briefcase, Award, CheckCircle2, Shield, ArrowRight, 
  FileText, MessageSquare, ShieldCheck, BadgeCheck, BarChart3, 
  Languages, Clock, Gavel, Scale, History
} from 'lucide-react';
import './LawyerProfile.css';

const LawyerProfileView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lawyer = location.state?.lawyer;
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!lawyer) {
    return (
      <div className="profile-error-page animate-fade-in">
        <div className="error-glass-card">
          <Shield size={48} className="error-icon" />
          <h2>Profile Not Found</h2>
          <p>Please select a professional from our verified directory.</p>
          <button className="btn-solid-blue mt-6" onClick={() => navigate('/find-lawyer')}>Back to Directory</button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    navigate('/consultation-booking', { state: { selectedLawyer: lawyer.raw || lawyer } });
  };

  const handleAnalytics = () => {
    navigate(`/lawyer-analytics`, { state: { lawyer: lawyer.raw || lawyer } });
  };

  // Mock data fallbacks for properties that might not have been passed
  const casesWon = lawyer.casesWon || 150 + ((lawyer.id || 1) * 7) % 100;
  const successRate = lawyer.successRate || 75 + ((lawyer.id || 1) * 3) % 20;
  const languages = lawyer.languages || ['English', 'Hindi'];
  const rating = lawyer.rating || 4.5;
  const reviews = lawyer.reviews || 24;

  return (
    <div className="lawyer-profile-page animate-fade-in">
      
      {/* ─── Immersive Ultra-Premium Hero ─── */}
      <section className="profile-hero">
        <div className="profile-mesh-bg"></div>
        
        <div className="container profile-hero-content">
          <div className="profile-avatar-wrapper">
            <div className="avatar-rings"></div>
            <img src={lawyer.image} alt={lawyer.name} className="profile-hero-avatar" />
            {(lawyer.isVerified !== false) && (
              <div className="hero-verified-shield" title="Bar Council Verified">
                <ShieldCheck size={24} />
              </div>
            )}
          </div>
          
          <div className="profile-hero-info">
            <div className="hero-title-row">
              <h1 className="hero-name">{lawyer.name}</h1>
              {(lawyer.isVerified !== false) && (
                <div className="hero-badge verified"><CheckCircle2 size={16} /> Bar Verified</div>
              )}
              {rating >= 4.7 && (
                <div className="hero-badge top-rated"><Award size={16} /> Top Rated</div>
              )}
            </div>
            
            <h2 className="hero-specialty">{lawyer.specialization}</h2>
            
            <div className="hero-stats-grid">
              <div className="h-stat-card">
                <Star className="hs-icon yellow" size={20} fill="currentColor" />
                <div className="hs-data">
                  <strong>{rating}</strong>
                  <span>{reviews} Reviews</span>
                </div>
              </div>
              <div className="h-stat-card">
                <Briefcase className="hs-icon blue" size={20} />
                <div className="hs-data">
                  <strong>{lawyer.experienceYears || parseInt(lawyer.experience) || 12}</strong>
                  <span>Years Exp.</span>
                </div>
              </div>
              <div className="h-stat-card">
                <Gavel className="hs-icon green" size={20} />
                <div className="hs-data">
                  <strong>{casesWon}+</strong>
                  <span>Cases Won</span>
                </div>
              </div>
              <div className="h-stat-card">
                <BarChart3 className="hs-icon purple" size={20} />
                <div className="hs-data">
                  <strong>{successRate}%</strong>
                  <span>Success Rate</span>
                </div>
              </div>
            </div>

            <div className="hero-meta-bottom">
              <span className="meta-pill"><MapPin size={16} /> {lawyer.location}</span>
              <span className="meta-pill"><Languages size={16} /> {languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content & Architecture ─── */}
      <section className="profile-main-section">
        <div className="container profile-grid">
          
          {/* Left: Content Col */}
          <div className="profile-content-col">
            
            <div className="profile-tabs glass-panel">
              <button 
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                Profile & Expertise
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Client Reviews ({reviews})
              </button>
              <button 
                className="tab-btn analytics-tab"
                onClick={handleAnalytics}
              >
                <BarChart3 size={16} /> Analytics & History
              </button>
            </div>

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="tab-content animate-fade-in">
                
                <div className="glass-panel content-card mb-6">
                  <h3 className="card-title">Professional Biography</h3>
                  <div className="bio-text">
                    {lawyer.raw?.bio || `A highly distinguished professional in the field of ${lawyer.specialization}, bringing ${lawyer.experienceYears || parseInt(lawyer.experience) || 12} years of rigorous courtroom and advisory experience. Proven track record in securing favorable outcomes through meticulous legal strategy and client advocacy. Specializes in complex litigation, providing precise, actionable counsel while maintaining the highest standards of confidentiality and integrity.`}
                  </div>
                </div>

                <div className="glass-panel content-card mb-6">
                  <h3 className="card-title">Core Specialties & Domains</h3>
                  <div className="tags-container">
                    <span className="premium-tag active"><Scale size={14}/> {lawyer.specialization}</span>
                    <span className="premium-tag">Legal Consultation</span>
                    <span className="premium-tag">Contract Drafting</span>
                    <span className="premium-tag">Dispute Resolution</span>
                    <span className="premium-tag">Court Representation</span>
                    <span className="premium-tag">Legal Notices</span>
                  </div>
                </div>
                
                <div className="glass-panel content-card mb-6">
                  <div className="mini-analytics-banner">
                    <div className="mab-left">
                      <History size={24} className="mab-icon" />
                      <div>
                        <h4>Deep Dive into Case Performance</h4>
                        <p>View historical data, outcome splits, and practice areas.</p>
                      </div>
                    </div>
                    <button className="btn-solid-purple" onClick={handleAnalytics}>
                      View Analytics
                    </button>
                  </div>
                </div>

                <div className="glass-panel content-card">
                  <h3 className="card-title">Education & Credentials</h3>
                  <ul className="credentials-list">
                    <li><BadgeCheck size={18} className="cred-icon" /> Bar Council of India Registered</li>
                    <li><BadgeCheck size={18} className="cred-icon" /> Background Verified via JusticeSetu</li>
                    <li><BadgeCheck size={18} className="cred-icon" /> Practicing at {lawyer.location} Courts</li>
                    <li><BadgeCheck size={18} className="cred-icon" /> Native fluency in {languages.join(' and ')}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-content animate-fade-in">
                <div className="glass-panel content-card mb-6 rating-summary-card">
                  <div className="huge-rating">
                    <span className="score.gold">{rating}</span>
                    <div className="stars-row">
                      {[1,2,3,4,5].map(i => <Star key={i} fill={i <= Math.floor(rating) ? '#f59e0b' : 'transparent'} color="#f59e0b" size={24} />)}
                    </div>
                    <p className="total-reviews">Based on {reviews} verified appointments</p>
                  </div>
                </div>

                <div className="reviews-masonry">
                  <div className="review-card glass-panel">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">A</div>
                        <div>
                          <strong>Anonymous Citizen</strong>
                          <span className="review-date">May 2026</span>
                        </div>
                      </div>
                      <div className="review-score"><Star size={14} fill="currentColor" /> 5.0</div>
                    </div>
                    <p className="review-body">Extremely professional and gave incredibly clear guidance on how to proceed with my dispute. They broke down the legal jargon perfectly. Highly recommended.</p>
                  </div>

                  <div className="review-card glass-panel">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar" style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>R</div>
                        <div>
                          <strong>R. Sharma</strong>
                          <span className="review-date">April 2026</span>
                        </div>
                      </div>
                      <div className="review-score"><Star size={14} fill="currentColor" /> 4.5</div>
                    </div>
                    <p className="review-body">Very knowledgeable in {lawyer.specialization}. Solved my queries smoothly over a secure video consultation. The booking process was also flawless.</p>
                  </div>

                  <div className="review-card glass-panel">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar" style={{background: 'linear-gradient(135deg, #10b981, #3b82f6)'}}>P</div>
                        <div>
                          <strong>Priya D.</strong>
                          <span className="review-date">March 2026</span>
                        </div>
                      </div>
                      <div className="review-score"><Star size={14} fill="currentColor" /> 5.0</div>
                    </div>
                    <p className="review-body">I was completely lost with my property documentation before the consultation. The lawyer explained every step logically and helped me secure my rights.</p>
                  </div>
                  
                  <div className="review-card glass-panel">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar" style={{background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'}}>K</div>
                        <div>
                          <strong>K. Patel</strong>
                          <span className="review-date">Jan 2026</span>
                        </div>
                      </div>
                      <div className="review-score"><Star size={14} fill="currentColor" /> 4.0</div>
                    </div>
                    <p className="review-body">Straight to the point without wasting any time. Got exactly the advice I needed for my ongoing legal notice. Good communication skills.</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Right: Booking Engine */}
          <div className="profile-engine-col">
            <div className="booking-engine glass-panel sticky-panel">
              <div className="engine-header">
                <span className="engine-label">Standard Consultation</span>
                <div className="engine-price-row">
                  <h2 className="engine-price">{lawyer.price || `₹${lawyer.priceVal || 1500}`}</h2>
                  <span className="engine-duration">/ 30 mins</span>
                </div>
              </div>

              <div className="engine-features">
                <div className="engine-feature">
                  <div className="feature-icon-box success"><MessageSquare size={18} /></div>
                  <div className="feature-text">
                    <strong>Fast Response</strong>
                    <span>Usually replies within 2 hours</span>
                  </div>
                </div>
                <div className="engine-feature">
                  <div className="feature-icon-box neutral"><FileText size={18} /></div>
                  <div className="feature-text">
                    <strong>Flexible Format</strong>
                    <span>Secure Video or Audio call</span>
                  </div>
                </div>
                <div className="engine-feature">
                  <div className="feature-icon-box neutral"><Clock size={18} /></div>
                  <div className="feature-text">
                    <strong>24H Reschedule</strong>
                    <span>Modify booking anytime</span>
                  </div>
                </div>
              </div>

              <button className="btn-glow-book" onClick={handleBook}>
                Book Consultation <ArrowRight size={20} />
              </button>

              <div className="engine-footer">
                <Shield size={14} /> 100% Encrypted & Secure via JusticeSetu Vault
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LawyerProfileView;
