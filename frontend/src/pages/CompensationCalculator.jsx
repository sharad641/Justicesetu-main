import { useState, useMemo, useEffect } from 'react';
import { IndianRupee, RotateCcw, Copy, Download, User, Activity, Heart, BriefcaseMedical } from 'lucide-react';
import './CompensationCalculator.css';

// ─── Multiplier table (Motor Vehicles Act, 1988 – Second Schedule) ───
const AGE_MULTIPLIER = [
  [0, 15, 15], [16, 20, 16], [21, 25, 17], [26, 30, 17], [31, 35, 16],
  [36, 40, 15], [41, 45, 14], [46, 50, 12], [51, 55, 10], [56, 60, 8],
  [61, 65, 6], [66, 100, 5],
];

function getMultiplier(age) {
  for (const [min, max, mult] of AGE_MULTIPLIER) {
    if (age >= min && age <= max) return mult;
  }
  return 5;
}

const INJURY_TYPES = [
  { value: 'death', label: 'Death', deduction: 1/3 },
  { value: 'permanent_total', label: 'Permanent Total Disability', deduction: 0 },
  { value: 'permanent_partial', label: 'Permanent Partial Disability', deduction: 0 },
  { value: 'temporary', label: 'Temporary Disability', deduction: 0 },
  { value: 'grievous', label: 'Grievous Injury', deduction: 0 },
  { value: 'simple', label: 'Simple Injury', deduction: 0 },
];

function formatINR(num) {
  if (!num || isNaN(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

// ─── Animated Number Component ───
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 600; // ms
    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(start + (end - start) * easeProgress);

      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(end);
    };
    requestAnimationFrame(animate);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{Math.round(displayValue).toLocaleString('en-IN')}</>;
};


const CompensationCalculator = () => {
  const [age, setAge] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(25000);
  const [injuryType, setInjuryType] = useState('death');
  const [disability, setDisability] = useState(50);
  const [medicalExpenses, setMedicalExpenses] = useState(100000);
  const [lossOfAmenities, setLossOfAmenities] = useState(50000);
  const [funeralExpenses, setFuneralExpenses] = useState(25000);
  const [transportCost, setTransportCost] = useState(10000);
  const [toast, setToast] = useState('');

  // ─── Math Calculation ───
  const result = useMemo(() => {
    const annualIncome = monthlyIncome * 12;
    const multiplier = getMultiplier(age);
    const injuryData = INJURY_TYPES.find(i => i.value === injuryType);
    const personalDeduction = injuryData?.deduction || 0;

    const netAnnualIncome = annualIncome - (annualIncome * personalDeduction);

    let futureProspect = 0;
    if (age < 40) futureProspect = 0.40;
    else if (age <= 50) futureProspect = 0.25;
    else futureProspect = 0.10;

    const incomeWithProspect = netAnnualIncome + (netAnnualIncome * futureProspect);
    let lossOfIncome = incomeWithProspect * multiplier;

    if (injuryType === 'permanent_partial' || injuryType === 'grievous') {
      lossOfIncome = lossOfIncome * (disability / 100);
    }
    if (injuryType === 'temporary' || injuryType === 'simple') {
      lossOfIncome = (monthlyIncome * 6) * (disability / 100);
    }

    const medical = Number(medicalExpenses) || 0;
    const amenities = Number(lossOfAmenities) || 0;
    const funeral = (injuryType === 'death') ? (Number(funeralExpenses) || 0) : 0;
    const transport = Number(transportCost) || 0;

    let conventionalDamages = 0;
    if (injuryType === 'death') conventionalDamages = 70000;
    else if (injuryType === 'permanent_total') conventionalDamages = 100000;
    else if (injuryType === 'permanent_partial') conventionalDamages = 50000;
    else conventionalDamages = 25000;

    const totalCompensation = lossOfIncome + medical + amenities + funeral + transport + conventionalDamages;

    return {
      annualIncome, netAnnualIncome, futureProspectPct: futureProspect * 100, incomeWithProspect,
      multiplier, lossOfIncome, medical, amenities, funeral, transport, conventionalDamages, totalCompensation,
      personalDeduction: personalDeduction * 100,
    };
  }, [age, monthlyIncome, injuryType, disability, medicalExpenses, lossOfAmenities, funeralExpenses, transportCost]);

  // Breakdown for Chart & Legend
  const breakdownItems = [
    { id: 'loss', label: 'Loss of Income', value: result.lossOfIncome, color: '#38bdf8' },
    { id: 'medical', label: 'Medical Expenses', value: result.medical, color: '#f43f5e' },
    { id: 'amenities', label: 'Loss of Amenities', value: result.amenities, color: '#facc15' },
    ...(result.funeral > 0 ? [{ id: 'funeral', label: 'Funeral Expenses', value: result.funeral, color: '#a78bfa' }] : []),
    { id: 'transport', label: 'Transport Charges', value: result.transport, color: '#34d399' },
    { id: 'conventional', label: 'Conventional Damages', value: result.conventionalDamages, color: '#fb923c' },
  ].filter(i => i.value > 0);

  // ─── SVG Donut Chart Logic ───
  const totalVal = breakdownItems.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleReset = () => {
    setAge(30); setMonthlyIncome(25000); setInjuryType('death'); setDisability(50);
    setMedicalExpenses(100000); setLossOfAmenities(50000); setFuneralExpenses(25000); setTransportCost(10000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Estimated Motor Accident Compensation: ${formatINR(result.totalCompensation)}\nRun on JusticeSetu Calculator.`);
    showToast('Copied to clipboard');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="calc-page">
      <div className="calc-header">
        <span className="calc-header-tag">MV Act 1988 Compliance</span>
        <h1>Compensation Calculator</h1>
        <p>Estimate accident claims instantly based on the Supreme Court's Pranay Sethi guidelines and Second Schedule multipliers. Your smart legal fin-tech tool.</p>
      </div>

      <div className="calc-container">
        
        {/* ─── LEFT: Form Area ─── */}
        <div className="calc-form-area">
          <div className="calc-section-title">
            <User size={20} className="text-blue-400" /> Victim Details
          </div>

          <div className="form-grid">
            {/* Age Slider */}
            <div className="input-group">
              <label><span>Age</span> <span className="badge">{age} yr</span></label>
              <input type="range" className="modern-slider" min="1" max="80" value={age} 
                     onChange={e => setAge(+e.target.value)} 
                     style={{ '--percent': `${(age/80)*100}%` }} />
              <div className="slider-hints"><span>1 yr</span><span>Multiplier: ×{getMultiplier(age)}</span><span>80 yr</span></div>
            </div>

            {/* Income Slider */}
            <div className="input-group">
              <label><span>Monthly Income</span> <span className="badge">{formatINR(monthlyIncome)}</span></label>
              <input type="range" className="modern-slider" min="5000" max="500000" step="1000" value={monthlyIncome} 
                     onChange={e => setMonthlyIncome(+e.target.value)} 
                     style={{ '--percent': `${(monthlyIncome/500000)*100}%` }} />
              <div className="slider-hints"><span>₹5K</span><span>Annual: {formatINR(monthlyIncome*12)}</span><span>₹5L</span></div>
            </div>
          </div>

          <div className="calc-section-title" style={{ marginTop: '16px' }}>
            <Activity size={20} className="text-red-400" /> Injury & Damages
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Type of Injury</label>
              <select className="modern-select" value={injuryType} onChange={e => setInjuryType(e.target.value)}>
                {INJURY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label><span>Disability %</span> <span className="badge">{disability}%</span></label>
              <input type="range" className="modern-slider" min="0" max="100" value={disability} 
                     onChange={e => setDisability(+e.target.value)} 
                     style={{ '--percent': `${disability}%`, background: `linear-gradient(to right, #f43f5e var(--percent), #1e293b var(--percent))` }} />
              <div className="slider-hints"><span>0%</span><span>100%</span></div>
            </div>
          </div>

          <div className="form-grid">
             <div className="input-group input-with-icon">
              <label>Medical Expenses (₹)</label>
              <div className="icon"><BriefcaseMedical size={18} /></div>
              <input type="number" className="modern-input" value={medicalExpenses} onChange={e => setMedicalExpenses(+e.target.value)} />
            </div>
            <div className="input-group input-with-icon">
              <label>Loss of Amenities (₹)</label>
              <div className="icon"><Heart size={18} /></div>
              <input type="number" className="modern-input" value={lossOfAmenities} onChange={e => setLossOfAmenities(+e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            {injuryType === 'death' && (
              <div className="input-group input-with-icon">
                <label>Funeral Expenses (₹)</label>
                <div className="icon"><IndianRupee size={18} /></div>
                <input type="number" className="modern-input" value={funeralExpenses} onChange={e => setFuneralExpenses(+e.target.value)} />
              </div>
            )}
            <div className="input-group input-with-icon">
              <label>Transport / Attendant (₹)</label>
              <div className="icon"><IndianRupee size={18} /></div>
              <input type="number" className="modern-input" value={transportCost} onChange={e => setTransportCost(+e.target.value)} />
            </div>
          </div>

          <button onClick={handleReset} className="btn-reset" style={{ marginTop: '24px' }}>
            <RotateCcw size={16} /> Reset Form
          </button>
        </div>

        {/* ─── RIGHT: Result Area ─── */}
        <div className="calc-result-area">
          <div className="calc-result-content">
            
            <div className="total-box">
              <div className="total-label">Estimated Award</div>
              <div className="total-amount">
                <span className="currency">₹</span>
                <AnimatedNumber value={result.totalCompensation} />
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="chart-container">
              <svg width="200" height="200" viewBox="0 0 160 160" className="chart-svg" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                {breakdownItems.map((item) => {
                  const segmentLength = (item.value / totalVal) * circumference;
                  const strokeDasharray = `${segmentLength} ${circumference}`;
                  const strokeDashoffset = -currentOffset;
                  currentOffset += segmentLength;
                  return (
                    <circle
                      key={item.id}
                      cx="80" cy="80" r={radius}
                      fill="none" stroke={item.color} strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dasharray 0.5s ease-out, stroke-dashoffset 0.5s ease-out' }}
                    />
                  );
                })}
              </svg>
              <div className="chart-center-text">
                <div className="title">Total</div>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="breakdown-list">
              {breakdownItems.map(item => (
                <div className="bd-item" key={item.id}>
                  <div className="bd-label-box">
                    <span className="bd-dot" style={{ backgroundColor: item.color, color: item.color }}></span>
                    <span className="bd-name">{item.label}</span>
                  </div>
                  <div className="bd-amt">{formatINR(item.value)}</div>
                </div>
              ))}
            </div>

            <div className="result-actions">
              <button className="btn-action btn-copy" onClick={handleCopy}><Copy size={18}/> Copy</button>
              <button className="btn-action btn-pdf" onClick={handleDownloadPDF}><Download size={18}/> Print / PDF</button>
            </div>
            
            {toast && (
              <div style={{ textAlign: 'center', color: '#10b981', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
                {toast}
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompensationCalculator;
