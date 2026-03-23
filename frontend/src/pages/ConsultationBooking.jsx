import { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, ChevronRight, CheckCircle2, FileText, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConsultationBooking.css';

const ConsultationBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedLawyer = location.state?.selectedLawyer;
  const lawyerName = selectedLawyer ? selectedLawyer.name : 'Legal Expert';
  const lawyerImage = selectedLawyer?.image || `https://ui-avatars.com/api/?name=Legal+Expert&background=0f172a&color=fff`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledAt = new Date(`${selectedDate} ${selectedTime}`);
    
    navigate('/payment', {
      state: {
        lawyerId: selectedLawyer?.id || 1,
        scheduledAt: scheduledAt,
        issueDescription: issueDescription,
        amount: selectedLawyer?.price || '₹1000'
      }
    });
  };

  const getDayLimits = () => {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return { min: today, max: maxDate.toISOString().split('T')[0] };
  };

  const { min, max } = getDayLimits();
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

  return (
    <div className="booking-page animate-fade-in">
      {/* Immersive Background */}
      <div className="booking-bg-glow">
        <div className="glow-orb orb-primary"></div>
        <div className="glow-orb orb-secondary"></div>
      </div>

      <div className="container booking-container">
        
        {/* Booking Card */}
        <div className="booking-card glass-card">
          
          {/* Header Panel */}
          <div className="booking-header">
            <div className="lawyer-min-profile">
              <img src={lawyerImage} alt={lawyerName} />
              <div>
                <h2>Book Session</h2>
                <p>with <strong>{lawyerName}</strong></p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="booking-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">{step > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
                <span>Schedule</span>
              </div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">{step > 2 ? <CheckCircle2 size={16} /> : '2'}</div>
                <span>Details</span>
              </div>
              <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Confirm</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="booking-body">
            
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="step-panel animate-fade-in">
                <h3 className="panel-title">Select Date & Time</h3>
                <p className="panel-subtitle">All times are shown in your local timezone.</p>
                
                <div className="form-group mt-6">
                  <label>Available Dates</label>
                  <div className="premium-date-input">
                    <Calendar className="icon" size={20} />
                    <input 
                      type="date" 
                      min={min} 
                      max={max}
                      value={selectedDate} 
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(''); // Reset time on date change
                      }} 
                    />
                  </div>
                </div>

                <div className="form-group mt-6 mb-6">
                  <label>Available Times {selectedDate && `for ${new Date(selectedDate).toLocaleDateString()}`}</label>
                  {selectedDate ? (
                    <div className="time-grid">
                      {timeSlots.map(time => (
                        <button 
                          key={time}
                          type="button"
                          className={`time-pill ${selectedTime === time ? 'active' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock size={16} className="pill-icon" /> {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="time-placeholder">Please select a date first to view available time slots.</div>
                  )}
                </div>

                <div className="booking-actions">
                  <button className="btn-fade" onClick={() => navigate(-1)}>Cancel</button>
                  <button 
                    className="btn-glow-primary" 
                    onClick={handleNext} 
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Issue Details */}
            {step === 2 && (
              <form className="step-panel animate-fade-in" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <h3 className="panel-title">Legal Issue Details</h3>
                <p className="panel-subtitle">Briefly describe your situation so the lawyer can prepare for the session.</p>
                
                <div className="form-group mt-6">
                  <label>Case Summary (Required)</label>
                  <div className="premium-textarea">
                    <textarea 
                      rows="5" 
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      required
                      placeholder="E.g., I have a property dispute regarding an inheritance and I need advice on drafting a legal notice..."
                    ></textarea>
                  </div>
                </div>

                <div className="form-group mt-6 mb-6">
                  <label>Relevant Documents (Optional)</label>
                  <div className="file-dropzone">
                    <FileText size={32} className="dropzone-icon" />
                    <strong>Click to upload</strong> or drag and drop files here
                    <span>PDF, Word, or JPG (Max 10MB)</span>
                    <input type="file" multiple />
                  </div>
                </div>

                <div className="booking-actions">
                  <button type="button" className="btn-fade icon-left" onClick={handleBack}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="btn-glow-primary" disabled={!issueDescription.trim()}>
                    Review Details <ChevronRight size={20} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Confirmation summary */}
            {step === 3 && (
              <div className="step-panel animate-fade-in" style={{ textAlign: 'center' }}>
                <div className="success-icon-large">
                  <Shield size={40} />
                </div>
                <h3 className="panel-title mx-auto mt-4">Confirm Your Booking</h3>
                <p className="panel-subtitle mx-auto mb-6">You will only be charged after the consultation is completed successfully.</p>
                
                <div className="summary-box">
                  <div className="summary-row">
                    <span>Legal Expert</span>
                    <strong>{lawyerName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Date & Time</span>
                    <strong>{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Consultation Fee</span>
                    <strong className="text-highlight">{selectedLawyer?.price || '₹1000'}</strong>
                  </div>
                </div>

                <div className="booking-actions justify-center mt-6" style={{ gap: '20px' }}>
                  <button type="button" className="btn-fade" onClick={handleBack}>Edit Details</button>
                  <button type="button" className="btn-glow-primary" onClick={handleSubmit}>
                    Proceed to Payment <CreditCard size={20} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
                
                <p className="secure-badge mt-6">
                  <Shield size={14} /> 256-bit Encrypted Vault Transaction
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationBooking;
