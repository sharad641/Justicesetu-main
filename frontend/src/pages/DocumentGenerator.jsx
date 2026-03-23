import { useState, useRef } from 'react';
import { FileText, ChevronRight, ChevronLeft, Download, Copy, Edit3, Eye, CheckCircle, AlertCircle, Scale, FileSignature, ShieldAlert, Printer } from 'lucide-react';
import './DocumentGenerator.css';

// ────────────── DOCUMENT TEMPLATES ──────────────
const DOC_TYPES = [
  {
    id: 'fir',
    label: 'FIR Draft',
    desc: 'First Information Report for police complaints',
    icon: <ShieldAlert size={28} />,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    fields: [
      { name: 'complainantName', label: 'Your Full Name', type: 'text', placeholder: 'e.g. Ramesh Kumar', required: true },
      { name: 'fatherName', label: "Father's / Husband's Name", type: 'text', placeholder: 'e.g. Suresh Kumar', required: true },
      { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'House No, Street, City, State, PIN', required: true },
      { name: 'phone', label: 'Contact Number', type: 'text', placeholder: 'e.g. 9876543210', required: true },
      { name: 'incidentDate', label: 'Date of Incident', type: 'date', required: true },
      { name: 'incidentTime', label: 'Time of Incident', type: 'text', placeholder: 'e.g. 10:30 PM', required: true },
      { name: 'incidentPlace', label: 'Place of Incident', type: 'text', placeholder: 'e.g. Near City Mall, MG Road', required: true },
      { name: 'accusedName', label: 'Name of Accused (if known)', type: 'text', placeholder: 'e.g. Unknown / John Doe' },
      { name: 'incidentDescription', label: 'Detailed Description of Incident', type: 'textarea', placeholder: 'Describe what happened in detail...', required: true },
      { name: 'lostItems', label: 'Items Lost / Damaged (if any)', type: 'textarea', placeholder: 'List all items with approximate value' },
      { name: 'witnesses', label: 'Witnesses (if any)', type: 'text', placeholder: 'e.g. Name and contact of witnesses' },
    ],
  },
  {
    id: 'affidavit',
    label: 'Affidavit',
    desc: 'Sworn legal statement on oath',
    icon: <FileSignature size={28} />,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    fields: [
      { name: 'deponentName', label: 'Full Name of Deponent', type: 'text', placeholder: 'e.g. Sita Devi', required: true },
      { name: 'fatherName', label: "Father's / Husband's Name", type: 'text', placeholder: 'e.g. Ram Prasad', required: true },
      { name: 'age', label: 'Age', type: 'text', placeholder: 'e.g. 35 years', required: true },
      { name: 'address', label: 'Full Residential Address', type: 'textarea', placeholder: 'House No, Street, City, State, PIN', required: true },
      { name: 'purpose', label: 'Purpose of Affidavit', type: 'text', placeholder: 'e.g. Name Change / Address Proof / Court Submission', required: true },
      { name: 'statementBody', label: 'Statement Details', type: 'textarea', placeholder: 'Write the main content of your sworn statement here...', required: true },
      { name: 'court', label: 'For Submission To (Court/Authority)', type: 'text', placeholder: 'e.g. District Court, Mumbai', required: true },
      { name: 'date', label: 'Date of Execution', type: 'date', required: true },
      { name: 'place', label: 'Place of Execution', type: 'text', placeholder: 'e.g. Mumbai', required: true },
    ],
  },
  {
    id: 'complaint',
    label: 'Complaint Letter',
    desc: 'Formal complaint to authorities or courts',
    icon: <Scale size={28} />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    fields: [
      { name: 'senderName', label: 'Your Full Name', type: 'text', placeholder: 'e.g. Priya Sharma', required: true },
      { name: 'senderAddress', label: 'Your Address', type: 'textarea', placeholder: 'House No, Street, City, State, PIN', required: true },
      { name: 'senderPhone', label: 'Phone Number', type: 'text', placeholder: 'e.g. 9876543210', required: true },
      { name: 'senderEmail', label: 'Email Address', type: 'text', placeholder: 'e.g. priya@example.com' },
      { name: 'recipientDesignation', label: 'Addressed To (Authority / Designation)', type: 'text', placeholder: 'e.g. The Station House Officer / District Collector', required: true },
      { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', placeholder: 'Full address of the authority', required: true },
      { name: 'subject', label: 'Subject Line', type: 'text', placeholder: 'e.g. Complaint regarding noise pollution', required: true },
      { name: 'complaintBody', label: 'Complaint Details', type: 'textarea', placeholder: 'State your complaint with all relevant facts and dates...', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'relief', label: 'Relief / Action Sought', type: 'textarea', placeholder: 'What action do you expect the authority to take?' },
    ],
  },
  {
    id: 'legal_notice',
    label: 'Legal Notice',
    desc: 'Formal notice before filing a civil suit',
    icon: <ShieldAlert size={28} />,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    fields: [
      { name: 'senderName', label: 'Sender Full Name', type: 'text', placeholder: 'e.g. Amit Singh', required: true },
      { name: 'senderAddress', label: 'Sender Address', type: 'textarea', placeholder: 'Complete address with PIN code', required: true },
      { name: 'senderPhone', label: 'Phone Number', type: 'text', placeholder: 'e.g. 9876543210', required: true },
      { name: 'recipientName', label: 'Recipient Full Name', type: 'text', placeholder: 'e.g. XYZ Pvt Ltd / Mr. Rahul Verma', required: true },
      { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', placeholder: 'Complete address of the recipient', required: true },
      { name: 'subject', label: 'Subject of Notice', type: 'text', placeholder: 'e.g. Non-payment of dues / Breach of contract', required: true },
      { name: 'facts', label: 'Statement of Facts', type: 'textarea', placeholder: 'Describe the facts and background of the dispute in detail...', required: true },
      { name: 'legalBasis', label: 'Legal Basis / Sections Applicable', type: 'textarea', placeholder: 'e.g. Under Section 138 of NI Act / Section 9 of CPC' },
      { name: 'demand', label: 'Demand / Relief Sought', type: 'textarea', placeholder: 'State clearly what you demand from the recipient...', required: true },
      { name: 'timeLimit', label: 'Time Limit for Response (days)', type: 'text', placeholder: 'e.g. 15 days', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  {
    id: 'rent_agreement',
    label: 'Rent Agreement',
    desc: 'Standard rental / lease agreement',
    icon: <FileText size={28} />,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    fields: [
      { name: 'landlordName', label: 'Landlord Full Name', type: 'text', placeholder: 'e.g. Mr. Rajesh Gupta', required: true },
      { name: 'landlordAddress', label: 'Landlord Permanent Address', type: 'textarea', placeholder: 'Full address', required: true },
      { name: 'tenantName', label: 'Tenant Full Name', type: 'text', placeholder: 'e.g. Ms. Priya Verma', required: true },
      { name: 'tenantAddress', label: 'Tenant Permanent Address', type: 'textarea', placeholder: 'Full address', required: true },
      { name: 'propertyAddress', label: 'Rental Property Address', type: 'textarea', placeholder: 'Full address of the rented property', required: true },
      { name: 'monthlyRent', label: 'Monthly Rent (₹)', type: 'text', placeholder: 'e.g. 15,000', required: true },
      { name: 'securityDeposit', label: 'Security Deposit (₹)', type: 'text', placeholder: 'e.g. 50,000', required: true },
      { name: 'startDate', label: 'Agreement Start Date', type: 'date', required: true },
      { name: 'duration', label: 'Duration (months)', type: 'text', placeholder: 'e.g. 11 months', required: true },
      { name: 'specialTerms', label: 'Special Terms (if any)', type: 'textarea', placeholder: 'e.g. No pets allowed, maintenance included...' },
      { name: 'date', label: 'Date of Execution', type: 'date', required: true },
      { name: 'place', label: 'Place of Execution', type: 'text', placeholder: 'e.g. Pune', required: true },
    ],
  },
  {
    id: 'poa',
    label: 'Power of Attorney',
    desc: 'Authorize someone to act on your behalf',
    icon: <FileSignature size={28} />,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    fields: [
      { name: 'principalName', label: 'Principal (Your) Full Name', type: 'text', placeholder: 'e.g. Mr. Arvind Patel', required: true },
      { name: 'principalAddress', label: 'Principal Address', type: 'textarea', placeholder: 'Full address', required: true },
      { name: 'principalAge', label: 'Principal Age', type: 'text', placeholder: 'e.g. 45 years', required: true },
      { name: 'agentName', label: 'Attorney / Agent Full Name', type: 'text', placeholder: 'e.g. Mr. Sunil Patel', required: true },
      { name: 'agentAddress', label: 'Attorney / Agent Address', type: 'textarea', placeholder: 'Full address', required: true },
      { name: 'agentRelation', label: 'Relationship with Agent', type: 'text', placeholder: 'e.g. Son / Brother / Business Partner', required: true },
      { name: 'powers', label: 'Powers Granted (describe in detail)', type: 'textarea', placeholder: 'e.g. To sell property at Survey No. 123, to operate bank account...', required: true },
      { name: 'scope', label: 'Scope: General or Special?', type: 'text', placeholder: 'e.g. Special Power of Attorney', required: true },
      { name: 'date', label: 'Date of Execution', type: 'date', required: true },
      { name: 'place', label: 'Place of Execution', type: 'text', placeholder: 'e.g. Mumbai', required: true },
    ],
  },
  {
    id: 'bail',
    label: 'Bail Application',
    desc: 'Application for regular / anticipatory bail',
    icon: <Scale size={28} />,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    fields: [
      { name: 'applicantName', label: 'Applicant (Accused) Full Name', type: 'text', placeholder: 'e.g. Ramesh Yadav', required: true },
      { name: 'fatherName', label: "Father's Name", type: 'text', placeholder: 'e.g. Shyam Yadav', required: true },
      { name: 'age', label: 'Age', type: 'text', placeholder: 'e.g. 30 years', required: true },
      { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'Complete residential address', required: true },
      { name: 'firNumber', label: 'FIR Number', type: 'text', placeholder: 'e.g. FIR No. 102/2026', required: true },
      { name: 'policeStation', label: 'Police Station', type: 'text', placeholder: 'e.g. Sadar Bazaar PS, Delhi', required: true },
      { name: 'sections', label: 'Sections Charged Under', type: 'text', placeholder: 'e.g. Section 420, 406 IPC', required: true },
      { name: 'courtName', label: 'Court Name', type: 'text', placeholder: 'e.g. Court of Additional Sessions Judge, Dwarka Courts', required: true },
      { name: 'grounds', label: 'Grounds for Bail', type: 'textarea', placeholder: 'Describe why bail should be granted: no flight risk, cooperation, roots in community...', required: true },
      { name: 'bailType', label: 'Bail Type', type: 'text', placeholder: 'e.g. Regular Bail / Anticipatory Bail', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  {
    id: 'consumer',
    label: 'Consumer Complaint',
    desc: 'Complaint to Consumer Forum / Commission',
    icon: <ShieldAlert size={28} />,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    fields: [
      { name: 'complainantName', label: 'Complainant Full Name', type: 'text', placeholder: 'e.g. Meena Kumari', required: true },
      { name: 'complainantAddress', label: 'Complainant Address', type: 'textarea', placeholder: 'Full address with PIN', required: true },
      { name: 'complainantPhone', label: 'Phone Number', type: 'text', placeholder: 'e.g. 9876543210', required: true },
      { name: 'oppositeParty', label: 'Opposite Party (Company / Seller Name)', type: 'text', placeholder: 'e.g. ABC Electronics Pvt Ltd', required: true },
      { name: 'oppositeAddress', label: 'Opposite Party Address', type: 'textarea', placeholder: 'Full address of the company/seller', required: true },
      { name: 'productService', label: 'Product / Service Involved', type: 'text', placeholder: 'e.g. Samsung Galaxy S24 / Home Loan', required: true },
      { name: 'purchaseDate', label: 'Date of Purchase / Service', type: 'date', required: true },
      { name: 'amountPaid', label: 'Amount Paid (₹)', type: 'text', placeholder: 'e.g. 75,000', required: true },
      { name: 'deficiency', label: 'Nature of Deficiency / Defect', type: 'textarea', placeholder: 'Describe the defect in product or deficiency in service...', required: true },
      { name: 'previousComplaints', label: 'Previous Complaints Made (if any)', type: 'textarea', placeholder: 'e.g. Called customer care on 10/03/2026, reference no. 12345' },
      { name: 'reliefSought', label: 'Relief / Compensation Sought', type: 'textarea', placeholder: 'e.g. Full refund of ₹75,000 + ₹25,000 compensation for mental agony', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
];

// ────────────── TEMPLATE RENDERERS ──────────────
function renderFIR(data) {
  const d = data;
  return `
<h2>FIRST INFORMATION REPORT (FIR) DRAFT</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( Under Section 154 of the Code of Criminal Procedure, 1973 )</p>

<h3>To,</h3>
<p>The Station House Officer,<br/>
Police Station: _______________<br/>
District: _______________</p>

<h3>Subject: Request for Registration of FIR</h3>

<p><strong>Respected Sir/Madam,</strong></p>

<p>I, <span class="doc-field-highlight">${d.complainantName || '________'}</span>, S/o / D/o / W/o <span class="doc-field-highlight">${d.fatherName || '________'}</span>, aged _______ years, a resident of <span class="doc-field-highlight">${d.address || '________'}</span>, Contact No: <span class="doc-field-highlight">${d.phone || '________'}</span>, do hereby lodge this complaint and request you to register an FIR in connection with the following incident:</p>

<h3>Details of the Incident:</h3>
<p><strong>Date:</strong> <span class="doc-field-highlight">${d.incidentDate || '________'}</span></p>
<p><strong>Time:</strong> <span class="doc-field-highlight">${d.incidentTime || '________'}</span></p>
<p><strong>Place:</strong> <span class="doc-field-highlight">${d.incidentPlace || '________'}</span></p>
<p><strong>Name of Accused:</strong> <span class="doc-field-highlight">${d.accusedName || 'Unknown'}</span></p>

<h3>Description of the Incident:</h3>
<p>${d.incidentDescription || '_________________________________________________________________'}</p>

${d.lostItems ? `<h3>Items Lost / Damaged:</h3><p>${d.lostItems}</p>` : ''}
${d.witnesses ? `<h3>Witnesses:</h3><p>${d.witnesses}</p>` : ''}

<p>I solemnly state that the above facts are true and correct to the best of my knowledge and belief. I request you to kindly register an FIR and take necessary legal action in this matter.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: _______________</p>
    <p>Date: ${d.incidentDate || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      (Signature of Complainant)<br/>
      ${d.complainantName || '_______________'}
    </div>
  </div>
</div>
  `;
}

function renderAffidavit(data) {
  const d = data;
  return `
<h2>AFFIDAVIT</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( On Non-Judicial Stamp Paper of Rs. _____ )</p>

<p>I, <span class="doc-field-highlight">${d.deponentName || '________'}</span>, S/o / D/o / W/o <span class="doc-field-highlight">${d.fatherName || '________'}</span>, aged <span class="doc-field-highlight">${d.age || '________'}</span>, a resident of <span class="doc-field-highlight">${d.address || '________'}</span>, do hereby solemnly affirm and state on oath as follows:</p>

<h3>Purpose: ${d.purpose || '_______________'}</h3>

<p><strong>1.</strong> That I am the deponent herein and am competent to swear this affidavit.</p>

<p><strong>2.</strong> That the facts stated herein are true and correct to the best of my knowledge, belief, and information.</p>

<p><strong>3.</strong> ${d.statementBody || '________________________________________________________________________________________________'}</p>

<p><strong>4.</strong> That I am making this affidavit for the purpose of submission before <span class="doc-field-highlight">${d.court || '________'}</span> and for such other purposes as may be necessary.</p>

<p><strong>5.</strong> That I have not concealed any material fact and that no part of this affidavit is false.</p>

<p style="margin-top:20px;"><strong>VERIFICATION</strong></p>
<p>Verified at <span class="doc-field-highlight">${d.place || '________'}</span> on this <span class="doc-field-highlight">${d.date || '________'}</span> that the contents of the above affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: ${d.place || '_______________'}</p>
    <p>Date: ${d.date || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      (Signature of Deponent)<br/>
      ${d.deponentName || '_______________'}
    </div>
  </div>
</div>

<p style="margin-top:32px; font-size:0.85rem; color:#666;"><em>Before me,<br/>Notary Public / Oath Commissioner<br/>(Seal & Signature)</em></p>
  `;
}

function renderComplaint(data) {
  const d = data;
  return `
<h2>FORMAL COMPLAINT LETTER</h2>

<p style="text-align:right;">
<strong>From:</strong><br/>
${d.senderName || '________'}<br/>
${d.senderAddress ? d.senderAddress.replace(/\n/g, '<br/>') : '________'}<br/>
Phone: ${d.senderPhone || '________'}<br/>
${d.senderEmail ? `Email: ${d.senderEmail}<br/>` : ''}
Date: ${d.date || '________'}
</p>

<p>
<strong>To,</strong><br/>
${d.recipientDesignation || '________'}<br/>
${d.recipientAddress ? d.recipientAddress.replace(/\n/g, '<br/>') : '________'}
</p>

<p><strong>Subject: ${d.subject || '________'}</strong></p>

<p><strong>Respected Sir/Madam,</strong></p>

<p>I, <span class="doc-field-highlight">${d.senderName || '________'}</span>, a resident of the above-mentioned address, wish to bring to your kind attention the following matter for your consideration and necessary action:</p>

<p>${d.complaintBody || '________________________________________________________________________________________________'}</p>

${d.relief ? `<h3>Relief / Action Sought:</h3><p>${d.relief}</p>` : ''}

<p>I request you to kindly look into this matter on an urgent basis and take appropriate action as deemed necessary. I shall be grateful for your prompt response.</p>

<p>I am ready to provide any further information or documentation that may be required in this regard.</p>

<p>Thanking you in anticipation of your prompt consideration.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: _______________</p>
    <p>Date: ${d.date || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      Yours faithfully,<br/>
      ${d.senderName || '_______________'}
    </div>
  </div>
</div>
  `;
}

function renderLegalNotice(data) {
  const d = data;
  return `
<h2>LEGAL NOTICE</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( Under Section 80 of the Code of Civil Procedure, 1908 )</p>

<p style="text-align:right;">
Date: <span class="doc-field-highlight">${d.date || '________'}</span><br/>
<strong>Sent By Registered Post A.D.</strong>
</p>

<p><strong>From:</strong><br/>
<span class="doc-field-highlight">${d.senderName || '________'}</span><br/>
${d.senderAddress ? d.senderAddress.replace(/\n/g, '<br/>') : '________'}<br/>
Phone: ${d.senderPhone || '________'}</p>

<p><strong>To:</strong><br/>
<span class="doc-field-highlight">${d.recipientName || '________'}</span><br/>
${d.recipientAddress ? d.recipientAddress.replace(/\n/g, '<br/>') : '________'}</p>

<p><strong>Subject: ${d.subject || '________'}</strong></p>

<p><strong>Sir/Madam,</strong></p>

<p>Under the instructions and on behalf of my client, <span class="doc-field-highlight">${d.senderName || '________'}</span>, I hereby serve upon you the following Legal Notice:</p>

<h3>Statement of Facts:</h3>
<p>${d.facts || '________________________________________________________________________________________________'}</p>

${d.legalBasis ? `<h3>Legal Basis:</h3><p>${d.legalBasis}</p>` : ''}

<h3>Demand:</h3>
<p>${d.demand || '________________________________________________________________________________________________'}</p>

<p>You are hereby called upon to comply with the above demand within <span class="doc-field-highlight">${d.timeLimit || '15'} days</span> from the date of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you in the competent court of law, at your risk, cost, and consequences.</p>

<p>This notice is being sent without prejudice to any and all other rights and remedies available to my client under the law.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: _______________</p>
    <p>Date: ${d.date || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      Yours faithfully,<br/>
      ${d.senderName || '_______________'}<br/>
      (Through Advocate)
    </div>
  </div>
</div>
  `;
}

function renderRentAgreement(data) {
  const d = data;
  return `
<h2>RENT / LEASE AGREEMENT</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( As per the Transfer of Property Act, 1882 and relevant State Rent Control Laws )</p>

<p>This Rent Agreement is executed on <span class="doc-field-highlight">${d.date || '________'}</span> at <span class="doc-field-highlight">${d.place || '________'}</span>.</p>

<h3>BETWEEN</h3>
<p><strong>LANDLORD:</strong> <span class="doc-field-highlight">${d.landlordName || '________'}</span>, residing at ${d.landlordAddress ? d.landlordAddress.replace(/\n/g, ', ') : '________'} (hereinafter referred to as the <strong>"First Party / Landlord"</strong>)</p>

<p><strong>AND</strong></p>

<p><strong>TENANT:</strong> <span class="doc-field-highlight">${d.tenantName || '________'}</span>, residing at ${d.tenantAddress ? d.tenantAddress.replace(/\n/g, ', ') : '________'} (hereinafter referred to as the <strong>"Second Party / Tenant"</strong>)</p>

<h3>PROPERTY DETAILS</h3>
<p>The Landlord hereby agrees to let out and the Tenant agrees to take on rent the following property:<br/>
<span class="doc-field-highlight">${d.propertyAddress ? d.propertyAddress.replace(/\n/g, ', ') : '________'}</span></p>

<h3>TERMS AND CONDITIONS</h3>

<p><strong>1. RENT:</strong> The monthly rent shall be <span class="doc-field-highlight">₹${d.monthlyRent || '________'}</span> (Rupees ${d.monthlyRent || '________'} only), payable on or before the 5th of every month.</p>

<p><strong>2. SECURITY DEPOSIT:</strong> The Tenant has deposited a sum of <span class="doc-field-highlight">₹${d.securityDeposit || '________'}</span> as security deposit, refundable at the time of vacating the premises after deducting unpaid dues, if any.</p>

<p><strong>3. DURATION:</strong> This agreement shall be valid for a period of <span class="doc-field-highlight">${d.duration || '________'}</span> commencing from <span class="doc-field-highlight">${d.startDate || '________'}</span>.</p>

<p><strong>4. LOCK-IN PERIOD:</strong> The first 3 months shall be the lock-in period during which neither party may terminate the agreement.</p>

<p><strong>5. NOTICE PERIOD:</strong> Either party intending to vacate or terminate this agreement shall give at least one month's prior written notice.</p>

<p><strong>6. UTILITIES:</strong> Electricity, water, gas, and internet bills shall be borne by the Tenant separately.</p>

<p><strong>7. SUBLETTING:</strong> The Tenant shall not sublet or transfer the premises to any third party.</p>

<p><strong>8. MAINTENANCE:</strong> Minor repairs up to ₹2,000 shall be borne by the Tenant. Major structural repairs shall be the responsibility of the Landlord.</p>

<p><strong>9. USE:</strong> The premises shall be used strictly for residential purposes only.</p>

${d.specialTerms ? `<p><strong>10. SPECIAL TERMS:</strong> ${d.specialTerms}</p>` : ''}

<p>IN WITNESS WHEREOF, both parties have signed this agreement on the date and place mentioned above.</p>

<div class="doc-signature-block">
  <div>
    <div class="doc-signature-line">
      (Landlord)<br/>
      ${d.landlordName || '_______________'}
    </div>
  </div>
  <div>
    <div class="doc-signature-line">
      (Tenant)<br/>
      ${d.tenantName || '_______________'}
    </div>
  </div>
</div>

<p style="margin-top:32px;"><strong>WITNESSES:</strong></p>
<p>1. Name: _______________ &emsp; Signature: _______________</p>
<p>2. Name: _______________ &emsp; Signature: _______________</p>
  `;
}

function renderPOA(data) {
  const d = data;
  return `
<h2>${d.scope ? d.scope.toUpperCase() : 'POWER OF ATTORNEY'}</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( Under the Powers of Attorney Act, 1882 )</p>

<p><strong>KNOW ALL MEN BY THESE PRESENTS</strong> that I, <span class="doc-field-highlight">${d.principalName || '________'}</span>, aged <span class="doc-field-highlight">${d.principalAge || '________'}</span>, residing at ${d.principalAddress ? d.principalAddress.replace(/\n/g, ', ') : '________'}, (hereinafter called the <strong>"Principal"</strong>), do hereby appoint and authorize:</p>

<p><span class="doc-field-highlight">${d.agentName || '________'}</span>, residing at ${d.agentAddress ? d.agentAddress.replace(/\n/g, ', ') : '________'}, being my <span class="doc-field-highlight">${d.agentRelation || '________'}</span>, (hereinafter called the <strong>"Attorney"</strong>)</p>

<p>as my true and lawful Attorney, to act, do, and execute all or any of the following acts, deeds, and things on my behalf:</p>

<h3>POWERS GRANTED:</h3>
<p>${d.powers || '________________________________________________________________________________________________'}</p>

<h3>GENERAL CLAUSES:</h3>
<p><strong>1.</strong> The Attorney shall have the power to sign, execute, and deliver all documents, deeds, and writings as may be necessary.</p>
<p><strong>2.</strong> The Attorney may appear before any court, tribunal, government authority, or any other body and represent me.</p>
<p><strong>3.</strong> The Attorney may receive and give receipts for any monies or properties on my behalf.</p>
<p><strong>4.</strong> All acts done by the said Attorney shall be binding on me as if done by me personally.</p>
<p><strong>5.</strong> This Power of Attorney shall remain in force until revoked by me in writing.</p>

<p><strong>IN WITNESS WHEREOF</strong>, I have executed this Power of Attorney on <span class="doc-field-highlight">${d.date || '________'}</span> at <span class="doc-field-highlight">${d.place || '________'}</span>.</p>

<div class="doc-signature-block">
  <div>
    <div class="doc-signature-line">
      (Signature of Principal)<br/>
      ${d.principalName || '_______________'}
    </div>
  </div>
  <div>
    <div class="doc-signature-line">
      (Accepted by Attorney)<br/>
      ${d.agentName || '_______________'}
    </div>
  </div>
</div>

<p style="margin-top:32px; font-size:0.85rem; color:#666;"><em>Before me,<br/>Notary Public / Sub-Registrar<br/>(Seal & Signature)</em></p>
  `;
}

function renderBail(data) {
  const d = data;
  return `
<h2>APPLICATION FOR ${d.bailType ? d.bailType.toUpperCase() : 'BAIL'}</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( Under Section 437/439 of the Code of Criminal Procedure, 1973 )</p>

<p><strong>IN THE COURT OF</strong> <span class="doc-field-highlight">${d.courtName || '________'}</span></p>

<p><strong>${d.bailType || 'Bail'} Application No. _______ of 2026</strong></p>

<p style="text-align:center; margin: 20px 0;">
<strong>IN THE MATTER OF:</strong><br/><br/>
<span class="doc-field-highlight">${d.applicantName || '________'}</span> ........ Applicant/Accused<br/>
<strong>Vs.</strong><br/>
State ........ Respondent<br/><br/>
<strong>FIR No.:</strong> <span class="doc-field-highlight">${d.firNumber || '________'}</span><br/>
<strong>P.S.:</strong> <span class="doc-field-highlight">${d.policeStation || '________'}</span><br/>
<strong>Under Sections:</strong> <span class="doc-field-highlight">${d.sections || '________'}</span>
</p>

<h3>MOST RESPECTFULLY SHOWETH:</h3>

<p><strong>1.</strong> That the applicant, <span class="doc-field-highlight">${d.applicantName || '________'}</span>, S/o <span class="doc-field-highlight">${d.fatherName || '________'}</span>, aged <span class="doc-field-highlight">${d.age || '________'}</span>, resident of <span class="doc-field-highlight">${d.address ? d.address.replace(/\n/g, ', ') : '________'}</span>, is the accused in the above-mentioned FIR.</p>

<p><strong>2.</strong> That the applicant has been falsely implicated in the present case and is innocent.</p>

<p><strong>3.</strong> That the investigation, if any, is complete and the applicant is no longer required for custodial interrogation.</p>

<h3>GROUNDS FOR BAIL:</h3>
<p><strong>4.</strong> ${d.grounds || '________________________________________________________________________________________________'}</p>

<p><strong>5.</strong> That the applicant is a law-abiding citizen with deep roots in the community and there is no likelihood of the applicant absconding or tampering with evidence.</p>

<p><strong>6.</strong> That the applicant undertakes to cooperate with the investigation and shall attend the court on each and every date of hearing.</p>

<h3>PRAYER:</h3>
<p>In the light of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:</p>
<p>(a) Grant ${d.bailType || 'Bail'} to the applicant in FIR No. ${d.firNumber || '________'}.</p>
<p>(b) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: _______________</p>
    <p>Date: ${d.date || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      (Applicant / Through Advocate)<br/>
      ${d.applicantName || '_______________'}
    </div>
  </div>
</div>
  `;
}

function renderConsumer(data) {
  const d = data;
  return `
<h2>CONSUMER COMPLAINT</h2>
<p style="text-align:center; font-size:0.85rem; color:#555;">( Under Section 35 of the Consumer Protection Act, 2019 )</p>

<p><strong>BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL FORUM</strong></p>

<p style="text-align:center; margin: 20px 0;">
<strong>Consumer Complaint No. _______ / 2026</strong><br/><br/>
<span class="doc-field-highlight">${d.complainantName || '________'}</span> ........ Complainant<br/>
<strong>Vs.</strong><br/>
<span class="doc-field-highlight">${d.oppositeParty || '________'}</span> ........ Opposite Party
</p>

<h3>DETAILS OF COMPLAINANT:</h3>
<p>Name: <span class="doc-field-highlight">${d.complainantName || '________'}</span><br/>
Address: ${d.complainantAddress ? d.complainantAddress.replace(/\n/g, ', ') : '________'}<br/>
Phone: ${d.complainantPhone || '________'}</p>

<h3>DETAILS OF OPPOSITE PARTY:</h3>
<p>Name: <span class="doc-field-highlight">${d.oppositeParty || '________'}</span><br/>
Address: ${d.oppositeAddress ? d.oppositeAddress.replace(/\n/g, ', ') : '________'}</p>

<h3>FACTS OF THE CASE:</h3>
<p><strong>1.</strong> The complainant purchased/availed the product/service, namely: <span class="doc-field-highlight">${d.productService || '________'}</span> from the Opposite Party on <span class="doc-field-highlight">${d.purchaseDate || '________'}</span> for a consideration of <span class="doc-field-highlight">₹${d.amountPaid || '________'}</span>.</p>

<p><strong>2.</strong> The complainant states that the aforesaid product/service was found to be defective / deficient as under:</p>
<p>${d.deficiency || '________________________________________________________________________________________________'}</p>

${d.previousComplaints ? `<p><strong>3.</strong> The complainant made the following complaints to the Opposite Party but received no satisfactory response:</p><p>${d.previousComplaints}</p>` : ''}

<p><strong>${d.previousComplaints ? '4' : '3'}.</strong> That the act of the Opposite Party amounts to unfair trade practice and deficiency in service under the Consumer Protection Act, 2019.</p>

<h3>RELIEF / COMPENSATION SOUGHT:</h3>
<p>${d.reliefSought || '________________________________________________________________________________________________'}</p>

<h3>PRAYER:</h3>
<p>In view of the above facts, it is most respectfully prayed that this Hon'ble Forum may be pleased to:</p>
<p>(a) Direct the Opposite Party to provide the relief as mentioned above.</p>
<p>(b) Award compensation for the mental agony and harassment caused to the complainant.</p>
<p>(c) Award costs of this complaint.</p>
<p>(d) Pass any other order(s) as this Hon'ble Forum may deem fit.</p>

<div class="doc-signature-block">
  <div>
    <p>Place: _______________</p>
    <p>Date: ${d.date || '_______________'}</p>
  </div>
  <div>
    <div class="doc-signature-line">
      (Complainant)<br/>
      ${d.complainantName || '_______________'}
    </div>
  </div>
</div>

<p style="margin-top:24px;"><strong>Verification:</strong> I hereby verify that the contents of this complaint are true and correct to the best of my knowledge and belief.</p>
  `;
}

const RENDERERS = {
  fir: renderFIR,
  affidavit: renderAffidavit,
  complaint: renderComplaint,
  legal_notice: renderLegalNotice,
  rent_agreement: renderRentAgreement,
  poa: renderPOA,
  bail: renderBail,
  consumer: renderConsumer,
};

// ────────── PDF PRINT HELPER ──────────
const PDF_STYLES = `
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 13px; line-height: 1.8; color: #1a1a1a; padding: 40px 48px; margin: 0; }
  h2 { text-align: center; font-size: 18px; text-transform: uppercase; letter-spacing: 3px; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 24px; }
  h3 { font-size: 14px; margin-top: 20px; margin-bottom: 8px; }
  p { margin-bottom: 10px; text-align: justify; }
  .doc-field-highlight { background: #fff3cd; padding: 1px 4px; border-radius: 3px; font-weight: 600; }
  .doc-signature-block { margin-top: 48px; display: flex; justify-content: space-between; }
  .doc-signature-block div { text-align: center; }
  .doc-signature-line { width: 180px; border-top: 1px solid #333; margin-top: 50px; padding-top: 8px; font-size: 12px; }
  @media print { body { padding: 20px; } }
`;

function downloadAsPDF(htmlContent, filename) {
  // Try html2pdf.js first via dynamic import
  import('html2pdf.js')
    .then(mod => {
      const html2pdf = mod.default;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = htmlContent;
      wrapper.style.fontFamily = "'Georgia', 'Times New Roman', serif";
      wrapper.style.fontSize = '13px';
      wrapper.style.lineHeight = '1.8';
      wrapper.style.color = '#1a1a1a';
      wrapper.style.padding = '40px 48px';
      wrapper.style.background = '#fff';

      // Style the highlights for PDF
      wrapper.querySelectorAll('.doc-field-highlight').forEach(el => {
        el.style.background = '#fff3cd';
        el.style.padding = '1px 4px';
        el.style.borderRadius = '3px';
        el.style.fontWeight = '600';
      });

      document.body.appendChild(wrapper);

      const opt = {
        margin: [10, 12, 10, 12],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().set(opt).from(wrapper).save().then(() => {
        document.body.removeChild(wrapper);
      }).catch(() => {
        document.body.removeChild(wrapper);
        printFallback(htmlContent, filename);
      });
    })
    .catch(() => {
      // Fallback: open a print-friendly window and use browser's Save as PDF
      printFallback(htmlContent, filename);
    });
}

function printFallback(htmlContent, filename) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to download PDF.');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html><head>
      <title>${filename}</title>
      <style>${PDF_STYLES}</style>
    </head><body>
      ${htmlContent}
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 300);
        };
      <\/script>
    </body></html>
  `);
  printWindow.document.close();
}

// ────────────── MAIN COMPONENT ──────────────
const DocumentGenerator = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: choose type, 1: fill form, 2: preview
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState('');
  const [toast, setToast] = useState('');
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const docConfig = DOC_TYPES.find(t => t.id === selectedType);

  // ─── Form handlers ───
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    if (!docConfig) return false;
    const newErrors = {};
    docConfig.fields.forEach(f => {
      if (f.required && !formData[f.name]?.trim()) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateDocument = () => {
    if (!validateForm()) return;
    const renderer = RENDERERS[selectedType];
    const html = renderer(formData);
    setEditedHtml(html);
    setCurrentStep(2);
    setIsEditing(false);
  };

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    setFormData({});
    setErrors({});
    setCurrentStep(1);
    setIsEditing(false);
    setEditedHtml('');
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setIsEditing(false);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setSelectedType(null);
    }
  };

  // ─── Copy ───
  const handleCopy = async () => {
    try {
      const el = document.createElement('div');
      el.innerHTML = editedHtml;
      await navigator.clipboard.writeText(el.innerText);
      showToast('✅ Copied to clipboard!');
    } catch {
      showToast('❌ Failed to copy');
    }
  };

  // ─── PDF Download ───
  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    showToast('📄 Generating PDF...');
    const filename = `${selectedType}_document_${Date.now()}.pdf`;
    try {
      downloadAsPDF(editedHtml, filename);
    } catch (e) {
      console.error('PDF error:', e);
      printFallback(editedHtml, filename);
    }
    setTimeout(() => setDownloading(false), 2000);
  };

  // ─── Print ───
  const handlePrint = () => {
    printFallback(editedHtml, `${selectedType}_document.pdf`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const steps = ['Select Document', 'Fill Details', 'Preview & Download'];

  // ────────────── RENDER ──────────────
  return (
    <div className="docgen-page">
      {/* Hero */}
      <div className="docgen-hero">
        <div className="docgen-hero-content">
          <h1>📄 Auto Legal Document Generator</h1>
          <p>Generate professionally formatted legal documents instantly. Choose a document type, fill in the details, and download your document as a PDF.</p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="docgen-steps-bar">
        {steps.map((label, i) => (
          <div key={i} className="docgen-step-indicator">
            <div className={`docgen-step-dot ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}`}>
              {i < currentStep ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`docgen-step-label ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}`}>{label}</span>
            {i < steps.length - 1 && <div className={`docgen-step-line ${i < currentStep ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>

      {/* ══════ STEP 0: Choose Document Type ══════ */}
      {currentStep === 0 && (
        <div className="animate-fade-in">
          <div className="docgen-type-grid">
            {DOC_TYPES.map(type => (
              <div
                key={type.id}
                className={`docgen-type-card ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => handleSelectType(type.id)}
              >
                <div className="docgen-type-icon" style={{ background: type.bg, color: type.color, border: `1px solid ${type.color}33` }}>
                  {type.icon}
                </div>
                <h3>{type.label}</h3>
                <p>{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ STEP 1: Fill Form ══════ */}
      {currentStep === 1 && docConfig && (
        <div className="animate-fade-in docgen-main-area">
          {/* Left: Form */}
          <div className="docgen-form-panel">
            <div className="docgen-panel-header">
              <h2><Edit3 size={20} style={{ color: docConfig.color }} /> {docConfig.label} – Fill Details</h2>
            </div>
            <div className="docgen-panel-body">
              {docConfig.fields.map(field => (
                <div className="docgen-field" key={field.name}>
                  <label>{field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className={errors[field.name] ? 'error' : ''}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={e => handleFieldChange(field.name, e.target.value)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className={errors[field.name] ? 'error' : ''}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={e => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                  {errors[field.name] && (
                    <div className="field-error"><AlertCircle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{errors[field.name]}</div>
                  )}
                </div>
              ))}

              <div className="docgen-btn-row">
                <button className="docgen-btn docgen-btn-secondary" onClick={handleBack}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button className="docgen-btn docgen-btn-primary" onClick={generateDocument}>
                  Generate Document <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="docgen-preview-panel">
            <div className="docgen-panel-header">
              <h2><Eye size={20} style={{ color: '#10b981' }} /> Live Preview</h2>
            </div>
            <div className="docgen-panel-body">
              <div className="docgen-preview-content" dangerouslySetInnerHTML={{ __html: RENDERERS[selectedType](formData) }} />
            </div>
          </div>
        </div>
      )}

      {/* ══════ STEP 2: Preview & Download ══════ */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          {/* Actions Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <button className="docgen-btn docgen-btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} /> Back to Edit
            </button>
            <div className="docgen-actions">
              <button className="docgen-btn docgen-btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <><Eye size={16} /> Preview</> : <><Edit3 size={16} /> Edit</>}
              </button>
              <button className="docgen-btn docgen-btn-secondary" onClick={handleCopy}>
                <Copy size={16} /> Copy
              </button>
              <button className="docgen-btn docgen-btn-secondary" onClick={handlePrint}>
                <Printer size={16} /> Print
              </button>
              <button className="docgen-btn docgen-btn-success" onClick={handleDownload} disabled={downloading}>
                <Download size={16} /> {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Document Preview or Edit */}
          <div className="docgen-preview-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="docgen-panel-header">
              <h2><FileText size={20} style={{ color: '#6366f1' }} /> {isEditing ? 'Edit Document' : 'Document Preview'}</h2>
            </div>
            <div className="docgen-panel-body">
              {isEditing ? (
                <textarea
                  className="docgen-edit-area"
                  value={editedHtml.replace(/<[^>]+>/g, match => {
                    if (match === '<br/>' || match === '<br>') return '\n';
                    if (match.startsWith('</p>') || match.startsWith('</h')) return '\n';
                    return '';
                  })}
                  onChange={e => {
                    const val = e.target.value;
                    setEditedHtml(val.split('\n').map(line => {
                      if (line.trim() === '') return '';
                      return `<p>${line}</p>`;
                    }).join(''));
                  }}
                />
              ) : (
                <div
                  ref={previewRef}
                  className="docgen-preview-content"
                  dangerouslySetInnerHTML={{ __html: editedHtml }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="docgen-toast"><CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />{toast}</div>}
    </div>
  );
};

export default DocumentGenerator;
