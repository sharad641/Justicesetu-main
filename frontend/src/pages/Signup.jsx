import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Scale, Shield, ArrowRight, Mail, Lock, Phone, Briefcase, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../api';
import './Auth.css';

const Signup = () => {
  const [userType, setUserType] = useState('citizen');
  const [step, setStep] = useState(1); // For multi-step lawyer signup
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    barCouncilId: '', specialization: '',
    password: '', confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill all basic details.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name, email: formData.email, phone: formData.phone,
        password: formData.password, role: userType,
      };
      
      if (userType === 'lawyer') {
        payload.barCouncilId = formData.barCouncilId;
        payload.specialization = formData.specialization;
      }

      await api.register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      {/* Background Animated Orbs */}
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>
      <div className="auth-bg-orb orb-3"></div>

      <div className="auth-container">
        
        {/* Left Info Panel */}
        <div className="auth-info-panel">
          <Link to="/" className="auth-logo">
            <div className="logo-icon-wrap"><Scale size={28} /></div>
            <h2>JusticeSetu</h2>
          </Link>

          <div className="auth-info-content">
            <h1 className="info-title">Join the Future of Legal Access</h1>
            <p className="info-desc">
              Whether you are seeking justice or providing legal expertise, our platform connects you seamlessly securely and efficiently.
            </p>

            <div className="info-features">
              <div className="info-feature">
                <div className="feature-icon"><Shield size={20} /></div>
                <div>
                  <h4>Bank-Grade Security</h4>
                  <p>End-to-end encrypted document vaults.</p>
                </div>
              </div>
              <div className="info-feature">
                <div className="feature-icon"><Scale size={20} /></div>
                <div>
                  <h4>Verified Professionals</h4>
                  <p>Only Bar Council verified lawyers.</p>
                </div>
              </div>
              <div className="info-feature">
                <div className="feature-icon"><CheckCircle2 size={20} /></div>
                <div>
                  <h4>Real-time Tracking</h4>
                  <p>Monitor case progress instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            
            <div className="auth-header text-center mb-6">
              <h2 className="heading-3">Create an Account</h2>
              <p className="text-muted">Start your legal journey today.</p>
            </div>

            {/* Role Toggle */}
            <div className="role-toggle-container mb-6">
              <button 
                className={`role-btn ${userType === 'citizen' ? 'active' : ''}`}
                onClick={() => { setUserType('citizen'); setStep(1); setError(''); }}
                type="button"
              >
                <User size={18} /> Citizen
              </button>
              <button 
                className={`role-btn ${userType === 'lawyer' ? 'active' : ''}`}
                onClick={() => { setUserType('lawyer'); setStep(1); setError(''); }}
                type="button"
              >
                <Scale size={18} /> Lawyer
              </button>
            </div>

            {error && (
              <div className="auth-error-alert animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              
              {/* Step 1: Basic Info for both, OR all info if Citizen */}
              {step === 1 && (
                <div className="form-step animate-fade-in">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-icon-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-icon-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" name="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-icon-wrapper">
                      <Phone className="input-icon" size={18} />
                      <input type="tel" name="phone" placeholder="+91 9876543210" required value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  {userType === 'citizen' ? (
                    <>
                      <div className="form-group">
                        <label>Password</label>
                        <div className="input-icon-wrapper">
                          <Lock className="input-icon" size={18} />
                          <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-icon-wrapper">
                          <Lock className="input-icon" size={18} />
                          <input type="password" name="confirmPassword" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                      </div>
                      <button type="submit" className="btn-auth-submit mt-4" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={handleNext} className="btn-auth-next mt-4">
                      Next Details <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Lawyer Specific Details */}
              {step === 2 && userType === 'lawyer' && (
                <div className="form-step animate-fade-in">
                  <div className="form-group">
                    <label>Bar Council Identification Number</label>
                    <div className="input-icon-wrapper">
                      <Shield className="input-icon" size={18} />
                      <input type="text" name="barCouncilId" placeholder="e.g. MAH/123/2015" required value={formData.barCouncilId} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Primary Specialization</label>
                    <div className="input-icon-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <select name="specialization" required value={formData.specialization} onChange={handleChange} className="auth-select">
                        <option value="" disabled>Select Specialization</option>
                        {['Criminal Law', 'Civil Law', 'Family Law', 'Corporate Law', 'Property Law', 'Tax Law', 'Intellectual Property'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-icon-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-icon-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" name="confirmPassword" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-auth-back flex-1">
                      Back
                    </button>
                    <button type="submit" className="btn-auth-submit flex-2" disabled={loading}>
                      {loading ? 'Registering...' : 'Complete Lawyer Reg'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="auth-footer mt-6">
              <p>Already have an account? <Link to="/login" className="auth-link-glow">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
