import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import api from '../api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
      
      if (data.user.role === 'citizen') {
        navigate('/citizen-dashboard');
      } else if (data.user.role === 'lawyer') {
        if (!data.user.bio || !data.user.consultationFee) {
          navigate('/lawyer-setup');
        } else {
          navigate('/lawyer-dashboard');
        }
      } else if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      {/* Background Animated Orbs */}
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>

      <div className="auth-container reverse">
        
        {/* Left Info Panel */}
        <div className="auth-info-panel login-panel">
          <Link to="/" className="auth-logo">
            <div className="logo-icon-wrap"><Scale size={28} /></div>
            <h2>JusticeSetu</h2>
          </Link>

          <div className="auth-info-content">
            <h1 className="info-title">Welcome Back</h1>
            <p className="info-desc">
              Log in to your dashboard to track cases, manage consultations, and secure your legal documents.
            </p>

            <div className="login-stats">
              <div className="stat-box">
                <Shield size={24} className="text-highlight" />
                <span className="stat-val">100%</span>
                <span className="stat-name">Secure Network</span>
              </div>
              <div className="stat-box">
                <UserCheck size={24} className="text-highlight" />
                <span className="stat-val">15k+</span>
                <span className="stat-name">Active Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            
            <div className="auth-header text-center mb-6">
              <h2 className="heading-3">Sign in to your account</h2>
              <p className="text-muted">Enter your verified credentials below.</p>
            </div>

            {error && (
              <div className="auth-error-alert animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              
              <div className="form-group mb-4">
                <label>Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label style={{ margin: 0 }}>Password</label>
                  <a href="#" className="forgot-pwd-link">Forgot password?</a>
                </div>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-options mb-6">
                <label className="checkbox-custom">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember for 30 days
                </label>
              </div>

              <button type="submit" className="btn-auth-submit mt-2" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In Securely'}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-footer text-center mt-6">
              <p>Don't have an account? <Link to="/signup" className="auth-link-glow">Create Account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
