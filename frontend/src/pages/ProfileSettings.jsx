import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Briefcase, IndianRupee, Image, Save, Shield, Edit3, X, CheckCircle, Clock, Award, Star, Calendar, FileText, AlertTriangle } from 'lucide-react';
import api from '../api';
import './DashboardStyles.css';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState('personal');
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', phone: '', location: '',
    specialization: '', experienceYears: '', consultationFee: '',
    bio: '', profileImage: ''
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const u = await api.getProfile();
        setUser(u);
        setFormData({
          name: u.name || '', phone: u.phone || '', location: u.location || '',
          specialization: u.specialization || '', experienceYears: u.experienceYears || '',
          consultationFee: u.consultationFee || '', bio: u.bio || '', profileImage: u.profileImage || ''
        });
        calcCompletion(u);
      } catch (err) {
        console.error('Failed to load profile', err);
        localStorage.removeItem('user');
        window.location.href = '/login';
      } finally {
        setPageLoading(false);
      }
    };
    fetchMe();
  }, []);

  const calcCompletion = (data) => {
    let fields = ['name', 'phone', 'location'];
    if (data.role === 'lawyer') fields = [...fields, 'specialization', 'experienceYears', 'consultationFee', 'bio'];
    let filled = fields.filter(f => data[f] && String(data[f]).trim() !== '').length;
    setCompletionPercentage(Math.round((filled / fields.length) * 100));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) errs.phone = 'Enter a valid 10-digit phone number';
    if (user?.role === 'lawyer') {
      if (formData.experienceYears && (isNaN(formData.experienceYears) || formData.experienceYears < 0)) errs.experienceYears = 'Enter valid years';
      if (formData.consultationFee && (isNaN(formData.consultationFee) || formData.consultationFee < 0)) errs.consultationFee = 'Enter a valid fee';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true); setError(''); setSuccessMsg('');
    try {
      const payload = { ...formData };
      if (payload.experienceYears === '') delete payload.experienceYears;
      if (payload.consultationFee === '') delete payload.consultationFee;

      const res = await api.updateProfile(payload);
      const updated = { ...user, ...res.user };
      setUser(updated);
      const localUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...res.user }));
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      calcCompletion(updated);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    if (user) {
      setFormData({
        name: user.name || '', phone: user.phone || '', location: user.location || '',
        specialization: user.specialization || '', experienceYears: user.experienceYears || '',
        consultationFee: user.consultationFee || '', bio: user.bio || '', profileImage: user.profileImage || ''
      });
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%', padding: '14px 16px', fontSize: '0.95rem',
    background: isEditing ? 'rgba(15,23,42,0.8)' : 'rgba(15,23,42,0.3)',
    border: validationErrors[fieldName] ? '1px solid rgba(239,68,68,0.6)' : isEditing ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
    color: 'var(--text-main)', borderRadius: '12px', outline: 'none',
    transition: 'all 0.3s ease', fontFamily: 'inherit',
  });

  if (pageLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p>Loading your profile...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const isLawyer = user.role === 'lawyer';
  const avatarUrl = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=312e81&color=a5b4fc&size=128&bold=true`;

  return (
    <div className="animate-fade-in" style={{ padding: '0 4px' }}>

      {/* Toast Messages */}
      {successMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000, padding: '16px 24px', background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'slideInRight 0.3s ease' }}>
          <CheckCircle size={20} /> {successMsg}
        </div>
      )}
      {error && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000, padding: '16px 24px', background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      {/* Profile Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', borderRadius: '20px', padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.1), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <img src={avatarUrl} alt="Profile" style={{ width: '96px', height: '96px', borderRadius: '24px', objectFit: 'cover', border: '3px solid rgba(99,102,241,0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
            {isLawyer && user.isVerified && (
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16,185,129,0.4)' }}>
                <CheckCircle size={16} style={{ color: '#fff' }} />
              </div>
            )}
          </div>
          {/* Name + Meta */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{user.name}</h1>
              {isLawyer && (
                <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: user.isVerified ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: user.isVerified ? '#10b981' : '#f59e0b' }}>
                  {user.isVerified ? '✓ Verified' : '◷ Pending Verification'}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 10px', fontSize: '0.95rem' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: '12px', textTransform: 'capitalize' }}>{user.role}</span>
              {user.location && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {user.location}</span>}
              {isLawyer && user.specialization && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={12} /> {user.specialization}</span>}
            </div>
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 8px 20px rgba(99,102,241,0.3)', opacity: loading ? 0.7 : 1 }}>
                  <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Completion Bar + Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isLawyer ? '1fr 1fr 1fr 1fr' : '1fr', gap: '16px', marginBottom: '28px' }}>
        {/* Completion */}
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', gridColumn: isLawyer ? 'span 1' : 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Profile Completion</span>
            <span style={{ color: completionPercentage === 100 ? '#10b981' : '#6366f1', fontWeight: '800', fontSize: '1.1rem' }}>{completionPercentage}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${completionPercentage}%`, background: completionPercentage === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #6366f1, #4f46e5)', transition: 'width 0.8s ease', borderRadius: '4px' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '8px 0 0' }}>{completionPercentage === 100 ? '✨ Fully optimized!' : 'Complete your profile to build trust.'}</p>
        </div>

        {/* Lawyer Stats */}
        {isLawyer && (
          <>
            <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <Star size={20} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px' }}>{user.rating || '—'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Rating</p>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <Award size={20} style={{ color: '#8b5cf6', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px' }}>{user.experienceYears || '—'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Years Exp.</p>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <IndianRupee size={20} style={{ color: '#10b981', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px' }}>₹{user.consultationFee || '—'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Per Hour</p>
            </div>
          </>
        )}
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(15,23,42,0.6)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { key: 'personal', label: 'Personal Info', icon: <UserIcon size={16} /> },
          ...(isLawyer ? [{ key: 'professional', label: 'Professional Details', icon: <Briefcase size={16} /> }] : []),
          { key: 'account', label: 'Account & Security', icon: <Shield size={16} /> },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key)} style={{
            flex: 1, padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontWeight: '600', fontSize: '0.88rem', transition: 'all 0.3s ease',
            background: activeSection === tab.key ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.1))' : 'transparent',
            color: activeSection === tab.key ? '#a5b4fc' : 'var(--text-muted)',
            boxShadow: activeSection === tab.key ? 'inset 0 0 0 1px rgba(99,102,241,0.3)' : 'none'
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ===== PERSONAL INFO SECTION ===== */}
      {activeSection === 'personal' && (
        <div className="animate-fade-in" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserIcon size={20} style={{ color: '#6366f1' }} /> Personal Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <UserIcon size={14} /> Full Name
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} placeholder="Your full name" style={inputStyle('name')} />
              {validationErrors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{validationErrors.name}</span>}
            </div>
            {/* Email */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Mail size={14} /> Email Address
              </label>
              <input type="email" value={user.email} disabled style={{ ...inputStyle(''), background: 'rgba(15,23,42,0.3)', cursor: 'not-allowed', opacity: 0.6 }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Email cannot be changed</span>
            </div>
            {/* Phone */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Phone size={14} /> Phone Number
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="Enter 10-digit number" style={inputStyle('phone')} />
              {validationErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{validationErrors.phone}</span>}
            </div>
            {/* Location */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <MapPin size={14} /> City / Location
              </label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} placeholder="e.g. New Delhi" style={inputStyle('location')} />
            </div>
          </div>
        </div>
      )}

      {/* ===== PROFESSIONAL DETAILS (Lawyers Only) ===== */}
      {activeSection === 'professional' && isLawyer && (
        <div className="animate-fade-in" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={20} style={{ color: '#8b5cf6' }} /> Professional Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Specialization */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Briefcase size={14} /> Specialization
              </label>
              {isEditing ? (
                <select name="specialization" value={formData.specialization} onChange={handleChange} style={{ ...inputStyle('specialization'), cursor: 'pointer' }}>
                  <option value="">Select Specialization</option>
                  {['Criminal Law', 'Civil Law', 'Family Law', 'Corporate Law', 'Constitutional Law', 'Property Law', 'Tax Law', 'Labor Law', 'Intellectual Property', 'Cyber Law', 'Human Rights', 'Banking Law', 'Environmental Law', 'Immigration Law', 'General Practice'].map(s => (
                    <option key={s} value={s} style={{ background: '#1e293b' }}>{s}</option>
                  ))}
                </select>
              ) : (
                <input type="text" value={formData.specialization || 'Not set'} disabled style={inputStyle('')} />
              )}
            </div>
            {/* Experience */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Clock size={14} /> Experience (Years)
              </label>
              <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 5" min="0" style={inputStyle('experienceYears')} />
              {validationErrors.experienceYears && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{validationErrors.experienceYears}</span>}
            </div>
            {/* Consultation Fee */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <IndianRupee size={14} /> Consultation Fee (₹/hr)
              </label>
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 1500" min="0" style={inputStyle('consultationFee')} />
              {validationErrors.consultationFee && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{validationErrors.consultationFee}</span>}
            </div>
            {/* Profile Image */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Image size={14} /> Profile Image URL
              </label>
              <input type="url" name="profileImage" value={formData.profileImage} onChange={handleChange} disabled={!isEditing} placeholder="https://example.com/photo.jpg" style={inputStyle('profileImage')} />
            </div>
            {/* Bar Council ID (Read Only) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <Shield size={14} /> Bar Council ID
              </label>
              <input type="text" value={user.barCouncilId || 'Not provided'} disabled style={{ ...inputStyle(''), opacity: 0.6, cursor: 'not-allowed' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Set during registration</span>
            </div>
            {/* Bio - Full Width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                <FileText size={14} /> Professional Biography
              </label>
              {isEditing ? (
                <textarea name="bio" rows="5" value={formData.bio} onChange={handleChange} placeholder="Describe your legal expertise, achievements, and approach to helping clients..." style={{ ...inputStyle('bio'), resize: 'vertical', lineHeight: '1.6' }} />
              ) : (
                <div style={{ padding: '16px', color: formData.bio ? 'var(--text-main)' : 'var(--text-muted)', background: 'rgba(15,23,42,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem', minHeight: '80px' }}>
                  {formData.bio || 'No biography added yet. Click "Edit Profile" to add one.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== ACCOUNT & SECURITY SECTION ===== */}
      {activeSection === 'account' && (
        <div className="animate-fade-in" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} style={{ color: '#10b981' }} /> Account & Security
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Account Info Cards */}
            {[
              { label: 'Account Type', value: user.role, icon: <UserIcon size={18} />, color: '#6366f1' },
              { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), icon: <Calendar size={18} />, color: '#3b82f6' },
              ...(isLawyer ? [{ label: 'Verification Status', value: user.isVerified ? 'Verified Professional' : 'Pending Verification', icon: user.isVerified ? <CheckCircle size={18} /> : <Clock size={18} />, color: user.isVerified ? '#10b981' : '#f59e0b' }] : []),
              { label: 'Email', value: user.email, icon: <Mail size={18} />, color: '#8b5cf6' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ color: 'var(--text-main)', fontWeight: '600', margin: 0, fontSize: '0.95rem', textTransform: 'capitalize' }}>{item.value}</p>
                </div>
              </div>
            ))}

            {/* Security Notice */}
            <div style={{ marginTop: '12px', padding: '20px', borderRadius: '14px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)' }}>
              <p style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: '600', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> Data Protection</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                Your personal data is encrypted and stored securely on our PostgreSQL infrastructure. We follow industry-standard security practices to protect your information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input:focus, textarea:focus, select:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
        input:disabled, textarea:disabled { cursor: default; }
        select option { background: #1e293b; color: #e2e8f0; }
        @media (max-width: 768px) {
          .animate-fade-in > div:first-child { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;
