import { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './Features.css';

const Payment = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure the booking data passed from Step 1
  const bookingData = location.state || {};
  
  // Calculate dynamic pricing
  const baseFee = parseInt(String(bookingData.amount || '1000').replace(/[^0-9]/g, ''));
  const platformFee = Math.round(baseFee * 0.1); // 10%
  const tax = Math.round((baseFee + platformFee) * 0.18); // 18% GST
  const total = baseFee + platformFee + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Fake processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Submit array to backend PostgreSQL
      await api.bookConsultation({
        lawyerId: bookingData.lawyerId,
        scheduledAt: bookingData.scheduledAt,
        issueDescription: bookingData.issueDescription,
        paymentStatus: 'paid'
      });
      
      setSuccess(true);
    } catch (err) {
      console.error("Payment submission failed:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-page section animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 40px' }}>
            <div style={{ display: 'inline-flex', background: '#10b981', color: '#fff', borderRadius: '50%', padding: '20px', marginBottom: '24px' }}>
              <CheckCircle size={48} />
            </div>
            <h2 className="heading-2" style={{ color: 'var(--navy-blue)', marginBottom: '16px' }}>Payment Successful!</h2>
            <p className="text-lead" style={{ marginBottom: '32px' }}>Your consultation has been booked successfully. You will receive a confirmation email shortly.</p>
            <button className="btn btn-primary" onClick={() => navigate('/citizen-dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page section animate-fade-in">
      <div className="container">
        <div className="section-title">
          <h1 className="heading-2">Secure Payment</h1>
          <p className="text-lead">Complete your payment to confirm the consultation booking.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Order Summary */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h3 className="heading-3" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Consultation Fee</span>
              <span style={{ fontWeight: '600' }}>₹{baseFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span>
              <span style={{ fontWeight: '600' }}>₹{platformFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tax (18% GST)</span>
              <span style={{ fontWeight: '600' }}>₹{tax}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '2px dashed rgba(255,255,255,0.1)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-glow)' }}>
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card">
            {error && <div className="auth-error mb-4" style={{ padding: '12px' }}>{error}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', fontWeight: '500' }}>
              <ShieldCheck size={20} /> 100% Secure Encrypted Payment
            </div>

            <form onSubmit={handlePayment}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cardholder Name</label>
                <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" required style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Expiry</label>
                  <input type="text" placeholder="MM/YY" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CVV</label>
                  <input type="password" placeholder="XXX" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }} disabled={loading}>
                {loading ? 'Processing Securely...' : `Pay ₹${total} Now`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
