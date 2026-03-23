import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Image, CheckCircle2, ArrowRight, ArrowLeft, Star, Award, Shield, Cpu, Scale } from 'lucide-react';
import api from '../api';
import './LawyerProfileSetup.css';

const LawyerProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experienceYears: '',
    location: '',
    consultationFee: '',
    bio: '',
    profileImage: '',
    specializations: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSpecialization = (spec) => {
    const updated = formData.specializations.includes(spec)
      ? formData.specializations.filter(s => s !== spec)
      : [...formData.specializations, spec];
    setFormData({ ...formData, specializations: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        experienceYears: parseInt(formData.experienceYears, 10),
        consultationFee: parseInt(formData.consultationFee, 10),
        profileImage: formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.location || 'lawyer'}`
      };

      const res = await api.updateProfile(payload);
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...res.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/lawyer-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const specializationsList = [
    "Criminal Law", "Civil Litigation", "Corporate", "Family Law", "Intellectual Property", 
    "Constitutional", "Cyber Law", "Real Estate", "Taxation", "Immigration"
  ];

  return (
    <div className="setup-v2-page">
      <div className="setup-bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      <div className="setup-container container">
        
        {/* Step Indicator */}
        <div className="setup-stepper">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`step-node ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
              <div className="node-circle">{step > num ? <CheckCircle2 size={18} /> : num}</div>
              <span className="node-label">
                {num === 1 ? 'Expertise' : num === 2 ? 'Pricing' : 'Preview'}
              </span>
            </div>
          ))}
          <div className="stepper-line">
            <div className="line-fill" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          </div>
        </div>

        <div className="setup-split-grid">
          
          {/* Main Form Side */}
          <div className="setup-form-card glass">
            {error && <div className="setup-error-badge">{error}</div>}

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              
              {step === 1 && (
                <div className="step-content animate-slide-in">
                  <h2 className="step-title">Your Professional <span className="text-cyan">Expertise</span></h2>
                  <p className="step-desc">Establish your authority in the JusticeSetu network.</p>
                  
                  <div className="input-grid">
                    <div className="setup-group">
                      <label>Practice Experience</label>
                      <div className="premium-input-wrap">
                        <Award className="pi-icon" size={20} />
                        <input name="experienceYears" type="number" placeholder="Years of experience" required value={formData.experienceYears} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="setup-group">
                      <label>Operational Hub</label>
                      <div className="premium-input-wrap">
                        <MapPin className="pi-icon" size={20} />
                        <input name="location" type="text" placeholder="City name" required value={formData.location} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="setup-group mt-6">
                    <label>Areas of Specialization</label>
                    <div className="spec-chips-container">
                      {specializationsList.map(spec => (
                        <button 
                          key={spec} 
                          type="button" 
                          className={`spec-chip ${formData.specializations.includes(spec) ? 'active' : ''}`}
                          onClick={() => toggleSpecialization(spec)}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="setup-actions">
                    <button type="submit" className="btn-setup-next">
                      Continue to Pricing <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content animate-slide-in">
                  <h2 className="step-title">Consultation <span className="text-cyan">Architecture</span></h2>
                  <p className="step-desc">Define your market presence and professional narrative.</p>

                  <div className="setup-group">
                    <label>Hourly Consultation Fee (INR)</label>
                    <div className="premium-input-wrap">
                      <Scale className="pi-icon" size={20} />
                      <input name="consultationFee" type="number" placeholder="e.g. 2000" required value={formData.consultationFee} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="setup-group mt-6">
                    <label>Professional Bio / Value Proposition</label>
                    <textarea 
                      name="bio"
                      rows="5"
                      placeholder="Craft a compelling narrative of your legal journey..."
                      required
                      value={formData.bio}
                      onChange={handleChange}
                      className="premium-textarea"
                    ></textarea>
                  </div>

                  <div className="setup-actions">
                    <button type="button" className="btn-setup-back" onClick={handleBack}>Back</button>
                    <button type="submit" className="btn-setup-next">
                      Review Presence <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content animate-slide-in">
                  <h2 className="step-title">Final <span className="text-cyan">Verification</span></h2>
                  <p className="step-desc">Your profile is ready to go live across the network.</p>

                  <div className="setup-group">
                    <label>Custom Profile Image URL (Optional)</label>
                    <div className="premium-input-wrap">
                      <Image className="pi-icon" size={20} />
                      <input name="profileImage" type="url" placeholder="Paste image link here" value={formData.profileImage} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="setup-checklist">
                    <div className="check-item"><Shield size={16} /> Data Encryption Enabled</div>
                    <div className="check-item"><Cpu size={16} /> AI Discovery Optimized</div>
                  </div>

                  <div className="setup-actions">
                    <button type="button" className="btn-setup-back" onClick={handleBack}>Back</button>
                    <button type="submit" className="btn-setup-submit" disabled={loading}>
                      {loading ? 'Initializing...' : 'Go Live Now'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Real-time Preview Side */}
          <div className="setup-preview-side">
            <div className="preview-label">Live Network Preview</div>
            
            <div className="lawyer-preview-card glass">
              <div className="lpc-header">
                <img 
                  src={formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.location || 'lawyer'}`} 
                  alt="Avatar" 
                  className="lpc-avatar"
                />
                <div className="lpc-status"><span className="dot pulse"></span> Online</div>
              </div>
              <div className="lpc-body">
                <h3>Advocate {formData.location ? `(at ${formData.location})` : 'Name'}</h3>
                <div className="lpc-exp">
                  <Award size={14} /> {formData.experienceYears || '0'}+ Years of Practice
                </div>
                <div className="lpc-specs">
                  {formData.specializations.slice(0, 3).map(s => <span key={s}>{s}</span>)}
                  {formData.specializations.length > 3 && <span>+{formData.specializations.length - 3} More</span>}
                  {formData.specializations.length === 0 && <span className="placeholder-spec">No Specializations...</span>}
                </div>
                <p className="lpc-bio">{formData.bio || 'Your professional biography will appear here as you type...'}</p>
              </div>
              <div className="lpc-footer">
                <div className="lpc-rate">
                  <span className="label">Fee</span>
                  <span className="value">₹{formData.consultationFee || '0'} / hr</span>
                </div>
                <button className="lpc-btn" type="button">Book Consultation</button>
              </div>
            </div>

            <div className="preview-features">
              <div className="pf-item"><Star size={16} className="text-gold" /> Profile Completion: {Math.min(100, (step * 33.3)).toFixed(0)}%</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LawyerProfileSetup;
