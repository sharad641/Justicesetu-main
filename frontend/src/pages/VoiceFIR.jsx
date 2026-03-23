import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, StopCircle, CheckCircle, RotateCcw, Download, Copy,
  Languages, ShieldCheck, FileSearch, Share2, MessageCircle,
  Mail, Clock, BarChart3, FileText, Scale, AlertTriangle
} from 'lucide-react';
import api from '../api';
import './VoiceFIR.css';

const LANGUAGES = [
  { code: 'en-IN', name: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
];

const STEPS = [
  { id: 1, label: 'Record', icon: Mic },
  { id: 2, label: 'Transcribe', icon: FileText },
  { id: 3, label: 'AI Generate', icon: Scale },
  { id: 4, label: 'Download', icon: Download },
];

// ─── Waveform Visualizer Component ───
const WaveformVisualizer = ({ isRecording, analyserRef }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      if (!isRecording || !analyserRef.current) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // Draw idle line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.moveTo(0, HEIGHT / 2);
        ctx.lineTo(WIDTH, HEIGHT / 2);
        ctx.stroke();
        return;
      }

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#10b981');

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRecording, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="waveform-canvas"
    />
  );
};

// ─── Recording Timer ───
const RecordingTimer = ({ isRecording }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) { setSeconds(0); return; }
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <span className={`rec-timer ${isRecording ? 'active' : ''}`}>
      {isRecording && <span className="rec-dot" />}
      {mins}:{secs}
    </span>
  );
};

// ─── Typing Dots Animation ───
const TypingDots = () => (
  <div className="typing-dots">
    <span /><span /><span />
    <p>AI is analyzing and drafting your FIR...</p>
  </div>
);

function formatINR(num) {
  if (!num || isNaN(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

// ─── Main Component ───
const VoiceFIR = () => {
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [structuredFIR, setStructuredFIR] = useState('');
  const [legalAnalysis, setLegalAnalysis] = useState('');
  const [activeTab, setActiveTab] = useState('fir');
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState('');
  const [showShare, setShowShare] = useState(false);

  const recognitionRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + ' ';
          }
        }
        if (finalText) {
          setTranscript(prev => prev + finalText);
          setCurrentStep(2);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        if (event.error === 'not-allowed') showToast('Microphone access denied!');
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    } else {
      showToast('Speech Recognition not supported. Use Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Start/Stop Audio Analyser for the Waveform
  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch (err) {
      console.error("Could not get audio stream for visualizer", err);
    }
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const toggleRecording = async () => {
    if (!recognitionRef.current) {
      showToast('Speech Recognition not supported.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      stopAudioAnalyser();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = selectedLang;
      try {
        await startAudioAnalyser();
        recognitionRef.current.start();
        setIsRecording(true);
        setCurrentStep(1);
      } catch (err) {
        console.error("Could not start recognition", err);
      }
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  // ─── Generate FIR + Legal Analysis ───
  const generateFIR = async () => {
    if (!transcript.trim()) {
      showToast('Please record or type your complaint first!');
      return;
    }
    setIsGenerating(true);
    setCurrentStep(3);

    try {
      // Prompt 1: Structured FIR
      const firPrompt = `You are an expert Indian Police Officer and Legal Drafter.
Take the following raw voice transcription of a complaint (which might be in Hindi, Marathi, English, or another regional Indian language) and translate it to clear, formal English.
Then, structure it into a standard First Information Report (FIR) format.

Format the output strictly as HTML using only: <h3>, <p>, <strong>, <ul>, <li>, <br/>.
Do NOT include markdown backticks.

Output Structure:
<h3>FIRST INFORMATION REPORT (FIR) DRAFT</h3>
<p><strong>To,</strong><br/>The Officer-In-Charge,<br/>[Police Station Name or '________']</p>
<p><strong>Subject:</strong> [Brief 1-line summary]</p>
<p><strong>Date & Time of Incident:</strong> [Extract or 'Not Specified']</p>
<p><strong>Place of Occurrence:</strong> [Extract or 'Not Specified']</p>
<p><strong>Details of Suspect/Accused:</strong> [Extract or 'Unknown']</p>
<h3>INCIDENT DETAILS</h3>
<p>[Formal first-person narrative of the incident]</p>
<h3>PRAYER</h3>
<p>I therefore request you to kindly register an FIR under the appropriate sections of the Bharatiya Nyaya Sanhita (BNS) / IPC and take necessary legal action.</p>
<p><strong>Signature/Thumb Impression</strong><br/>Name: [Extract or '________']<br/>Contact: [Extract or '________']</p>

Raw Transcript: "${transcript}"`;

      const firRes = await api.askAI(firPrompt, []);
      let cleanFIR = (firRes.answer || firRes.response || '').replace(/```(html)?/g, '').trim();
      setStructuredFIR(cleanFIR);

      // Prompt 2: Legal Analysis
      const analysisPrompt = `You are an expert Indian Criminal Law Advisor.
Based on the following complaint transcript, identify:
1. The nature of the offence
2. Applicable sections of the Bharatiya Nyaya Sanhita (BNS) 2023 AND the equivalent old IPC sections
3. Type of offence (Cognizable / Non-Cognizable, Bailable / Non-Bailable)
4. Recommended next steps for the complainant
5. Estimated court jurisdiction (which court would hear this case)

Format the output strictly as HTML using only: <h3>, <h4>, <p>, <strong>, <ul>, <li>, <table>, <tr>, <th>, <td>.
Do NOT include markdown backticks.

Start with:
<h3>LEGAL ANALYSIS REPORT</h3>
Then use <h4> for each numbered section above.
For sections mapping, use an HTML table with columns: BNS Section, IPC Equivalent, Description.

Raw Transcript: "${transcript}"`;

      const analysisRes = await api.askAI(analysisPrompt, []);
      let cleanAnalysis = (analysisRes.answer || analysisRes.response || '').replace(/```(html)?/g, '').trim();
      setLegalAnalysis(cleanAnalysis);

      setCurrentStep(4);
      showToast('FIR & Legal Analysis Generated!');

    } catch (err) {
      console.error(err);
      showToast('Failed to generate. Check your internet & AI backend.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setStructuredFIR('');
    setLegalAnalysis('');
    setCurrentStep(1);
    setActiveTab('fir');
    setShowShare(false);
  };

  const handlePrint = () => {
    const content = activeTab === 'fir' ? structuredFIR : legalAnalysis;
    const title = activeTab === 'fir' ? 'FIR Draft — JusticeSetu' : 'Legal Analysis — JusticeSetu';
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${title}</title>
      <style>body{font-family:Georgia,serif;font-size:14px;line-height:1.8;padding:40px 50px;color:#111;max-width:800px;margin:0 auto}
      h3{text-align:center;font-size:16px;border-bottom:2px solid #333;padding-bottom:8px;margin:24px 0 16px;text-transform:uppercase;letter-spacing:2px}
      h4{margin-top:20px;color:#333}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #ccc;padding:8px 12px;text-align:left;font-size:13px}th{background:#f5f5f5;font-weight:700}
      </style></head><body>${content}<script>window.onload=function(){window.print();window.close()}</script></body></html>`);
    w.document.close();
  };

  const handleCopy = () => {
    const content = activeTab === 'fir' ? structuredFIR : legalAnalysis;
    const div = document.createElement("div");
    div.innerHTML = content;
    navigator.clipboard.writeText(div.textContent || '');
    showToast('Copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const div = document.createElement("div");
    div.innerHTML = structuredFIR;
    const text = encodeURIComponent(div.textContent || '');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const div = document.createElement("div");
    div.innerHTML = structuredFIR;
    const body = encodeURIComponent(div.textContent || '');
    window.open(`mailto:?subject=FIR Draft - JusticeSetu&body=${body}`, '_blank');
  };

  return (
    <div className="voice-fir-page">
      {/* Header */}
      <div className="voice-header">
        <span className="voice-tag"><Languages size={14} /> Supports 10 Indian Languages</span>
        <h1>AI Voice FIR System</h1>
        <p>Speak in your native language. Our Legal AI translates, structures a formal Police FIR, and provides a full legal analysis with applicable BNS/IPC sections.</p>
      </div>

      {/* Step Progress Bar */}
      <div className="step-progress">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="step-circle">
                {isActive && currentStep > step.id ? <CheckCircle size={18} /> : <StepIcon size={18} />}
              </div>
              <span className="step-label">{step.label}</span>
              {idx < STEPS.length - 1 && <div className={`step-line ${currentStep > step.id ? 'filled' : ''}`} />}
            </div>
          );
        })}
      </div>

      <div className="voice-grid">

        {/* ─── LEFT: Recording Interface ─── */}
        <div className="recorder-panel">
          <div className="recorder-controls">

            {/* Language Selector */}
            <div className="lang-chips">
              <label className="section-label"><Languages size={16} /> Language</label>
              <div className="chip-grid">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-chip ${selectedLang === lang.code ? 'selected' : ''}`}
                    onClick={() => !isRecording && setSelectedLang(lang.code)}
                    disabled={isRecording}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mic + Waveform + Timer */}
            <div className="mic-area">
              <RecordingTimer isRecording={isRecording} />

              <button
                className={`mic-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <StopCircle size={36} /> : <Mic size={36} />}
              </button>

              <WaveformVisualizer isRecording={isRecording} analyserRef={analyserRef} />

              <div className={`status-text ${isRecording ? 'recording' : ''}`}>
                {isRecording ? '🔴 Listening... speak your complaint clearly' : 'Tap the mic to start recording'}
              </div>
            </div>

            {/* Transcript Box */}
            <div className="transcript-box">
              <div className="transcript-header">
                <label>Raw Transcript</label>
                <span className="word-count">{wordCount} words</span>
              </div>
              <textarea
                placeholder="Your spoken words appear here automatically. You can also type or paste text manually."
                value={transcript}
                onChange={(e) => { setTranscript(e.target.value); if(e.target.value.trim()) setCurrentStep(2); }}
              />
            </div>

            {/* Action Row */}
            <div className="action-buttons">
              <button className="btn-clear" onClick={handleReset} title="Reset All">
                <RotateCcw size={18} />
              </button>
              <button
                className={`btn-ai-gen ${isGenerating ? 'loading' : ''}`}
                onClick={generateFIR}
                disabled={!transcript.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>Generating<span className="dot-anim">...</span></>
                ) : (
                  <>Generate FIR + Analysis <CheckCircle size={16} /></>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ─── RIGHT: Result Panel ─── */}
        <div className="result-panel">

          {/* Tabs */}
          <div className="result-tabs">
            <button className={`tab-btn ${activeTab === 'fir' ? 'active' : ''}`} onClick={() => setActiveTab('fir')}>
              <ShieldCheck size={16} /> FIR Draft
            </button>
            <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
              <BarChart3 size={16} /> Legal Analysis
            </button>
          </div>

          {/* Content */}
          {isGenerating ? (
            <TypingDots />
          ) : !structuredFIR ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileSearch size={36} /></div>
              <h3>Awaiting Your Statement</h3>
              <p>Record your complaint, then click "Generate" to see the FIR document & legal analysis here.</p>
            </div>
          ) : (
            <>
              <div
                className="structured-fir-content"
                dangerouslySetInnerHTML={{ __html: activeTab === 'fir' ? structuredFIR : legalAnalysis }}
              />

              {/* Result Actions */}
              <div className="result-actions">
                <button className="btn-doc btn-doc-secondary" onClick={handleCopy}><Copy size={16} /> Copy</button>
                <button className="btn-doc btn-doc-primary" onClick={handlePrint}><Download size={16} /> Print PDF</button>
                <div className="share-wrapper">
                  <button className="btn-doc btn-doc-share" onClick={() => setShowShare(!showShare)}><Share2 size={16} /> Share</button>
                  {showShare && (
                    <div className="share-menu">
                      <button onClick={handleShareWhatsApp}><MessageCircle size={14} /> WhatsApp</button>
                      <button onClick={handleShareEmail}><Mail size={14} /> Email</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="disclaimer">
                <AlertTriangle size={14} />
                <span>This AI-generated draft is for reference only. Consult a lawyer before filing.</span>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-notification">{toast}</div>
      )}
    </div>
  );
};

export default VoiceFIR;
