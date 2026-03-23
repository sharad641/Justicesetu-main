import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, StopCircle, Pause, Play, RotateCcw, Download, Copy,
  Clock, FileText, Scale, CheckCircle, User, Gavel, MessageSquare,
  BarChart3, Share2, Mail, MessageCircle, AlertTriangle, Languages
} from 'lucide-react';
import api from '../api';
import './HearingTranscription.css';

const SPEAKER_ROLES = [
  { id: 'judge', label: 'Judge', color: '#f59e0b', icon: Gavel },
  { id: 'lawyer_p', label: 'Petitioner Lawyer', color: '#3b82f6', icon: Scale },
  { id: 'lawyer_r', label: 'Respondent Lawyer', color: '#ef4444', icon: Scale },
  { id: 'witness', label: 'Witness', color: '#10b981', icon: User },
  { id: 'clerk', label: 'Court Clerk', color: '#8b5cf6', icon: FileText },
  { id: 'other', label: 'Other', color: '#64748b', icon: MessageSquare },
];

const LANGUAGES = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'gu-IN', name: 'Gujarati' },
];

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ─── Waveform Visualizer ───
const WaveformVisualizer = ({ isActive, analyserRef }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (!isActive || !analyserRef.current) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(139,92,246,0.2)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        return;
      }

      const analyser = analyserRef.current;
      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteTimeDomainData(data);

      const gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#10b981');

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      const slice = W / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = data[i] / 128.0;
        const y = (v * H) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += slice;
      }
      ctx.lineTo(W, H / 2);
      ctx.stroke();
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, analyserRef]);

  return <canvas ref={canvasRef} width={500} height={50} className="ht-waveform" />;
};

const HearingTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [activeSpeaker, setActiveSpeaker] = useState('judge');
  const [entries, setEntries] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [caseInfo, setCaseInfo] = useState({ caseNumber: '', courtName: '', date: new Date().toISOString().split('T')[0] });
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState('transcript');
  const [toast, setToast] = useState('');

  const recognitionRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const transcriptEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const recog = new SR();
      recog.continuous = true;
      recog.interimResults = false; // Only final results for clean entries

      recog.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const text = event.results[i][0].transcript.trim();
            if (text) {
              setEntries(prev => [...prev, {
                id: Date.now(),
                speaker: activeSpeaker,
                text,
                timestamp: elapsed,
                confidence: Math.round(event.results[i][0].confidence * 100),
              }]);
            }
          }
        }
      };

      recog.onerror = (event) => {
        console.error('Speech error:', event.error);
        if (event.error === 'not-allowed') showToast('Microphone access denied!');
      };

      recog.onend = () => {
        // Auto-restart if still recording and not paused
        if (isRecording && !isPaused && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) { /* already started */ }
        }
      };

      recognitionRef.current = recog;
    }
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, [activeSpeaker, elapsed, isRecording, isPaused]);

  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch (e) { console.error("Audio analyser error", e); }
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    analyserRef.current = null;
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleStart = async () => {
    if (!recognitionRef.current) { showToast('Speech Recognition not supported.'); return; }
    recognitionRef.current.lang = selectedLang;
    await startAudioAnalyser();
    try { recognitionRef.current.start(); } catch (e) { /* */ }
    setIsRecording(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  const handlePause = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsPaused(true);
  };

  const handleResume = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang;
      try { recognitionRef.current.start(); } catch (e) { /* */ }
    }
    setIsPaused(false);
  };

  const handleStop = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    stopAudioAnalyser();
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    handleStop();
    setEntries([]);
    setElapsed(0);
    setSummary('');
    setActiveTab('transcript');
  };

  // ─── AI Summary ───
  const generateSummary = async () => {
    if (entries.length === 0) { showToast('No transcript to summarize!'); return; }
    setIsSummarizing(true);
    setActiveTab('summary');

    const fullTranscript = entries.map(e => {
      const role = SPEAKER_ROLES.find(r => r.id === e.speaker);
      return `[${formatTime(e.timestamp)}] ${role?.label || 'Speaker'}: ${e.text}`;
    }).join('\n');

    const prompt = `You are an expert Indian Court Reporter and Legal Analyst.
Below is a transcription of a court hearing with timestamps and speaker labels.

Analyze this transcript and provide:
1. A brief case summary (2-3 lines)
2. Key arguments made by each party
3. Important observations or orders by the Judge
4. Key legal points discussed (with relevant BNS/IPC/CrPC sections if identifiable)
5. Next steps or orders given

Format strictly as HTML using only: <h3>, <h4>, <p>, <strong>, <ul>, <li>.
Do NOT include markdown backticks.

Case Number: ${caseInfo.caseNumber || 'Not specified'}
Court: ${caseInfo.courtName || 'Not specified'}
Date: ${caseInfo.date}

Transcript:
${fullTranscript}`;

    try {
      const res = await api.askAI(prompt, []);
      const clean = (res.answer || res.response || '').replace(/```(html)?/g, '').trim();
      setSummary(clean);
      showToast('AI Summary Generated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handlePrint = () => {
    const content = activeTab === 'summary' && summary ? summary : buildTranscriptHTML();
    const title = `Court Hearing Transcript — ${caseInfo.caseNumber || 'JusticeSetu'}`;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${title}</title>
      <style>body{font-family:Georgia,serif;font-size:13px;line-height:1.7;padding:40px 50px;color:#111;max-width:900px;margin:0 auto}
      h3{text-align:center;font-size:16px;border-bottom:2px solid #333;padding-bottom:6px;margin:20px 0 14px;text-transform:uppercase;letter-spacing:2px}
      h4{margin-top:16px;color:#333}.entry{margin-bottom:10px;padding:8px 12px;border-left:3px solid #ccc}
      .ts{color:#888;font-size:11px;font-family:monospace}.speaker{font-weight:bold;color:#333}
      table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #ccc;padding:6px 10px;text-align:left;font-size:12px}th{background:#f5f5f5}
      </style></head><body>
      <h3>Court Hearing Transcript</h3>
      <p><strong>Case:</strong> ${caseInfo.caseNumber || '—'} | <strong>Court:</strong> ${caseInfo.courtName || '—'} | <strong>Date:</strong> ${caseInfo.date}</p>
      <p><strong>Duration:</strong> ${formatTime(elapsed)} | <strong>Entries:</strong> ${entries.length}</p>
      <hr/>${content}
      <script>window.onload=function(){window.print();window.close()}</script></body></html>`);
    w.document.close();
  };

  const buildTranscriptHTML = () => {
    return entries.map(e => {
      const role = SPEAKER_ROLES.find(r => r.id === e.speaker);
      return `<div class="entry" style="border-left-color:${role?.color || '#ccc'}">
        <span class="ts">[${formatTime(e.timestamp)}]</span> <span class="speaker" style="color:${role?.color}">${role?.label}:</span> ${e.text}
      </div>`;
    }).join('');
  };

  const handleCopy = () => {
    const text = entries.map(e => {
      const role = SPEAKER_ROLES.find(r => r.id === e.speaker);
      return `[${formatTime(e.timestamp)}] ${role?.label}: ${e.text}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Transcript copied!');
  };

  const wordCount = entries.reduce((acc, e) => acc + e.text.split(/\s+/).length, 0);

  return (
    <div className="ht-page">
      {/* Header */}
      <div className="ht-header">
        <span className="ht-tag"><Gavel size={14} /> Court Module</span>
        <h1>AI Hearing Transcription</h1>
        <p>Record live court proceedings with timestamped, speaker-labeled transcription. Generate AI-powered summaries with key legal points.</p>
      </div>

      {/* Case Info Bar */}
      <div className="ht-case-bar">
        <div className="case-field">
          <label>Case No.</label>
          <input type="text" placeholder="e.g. CRL-2024-1234" value={caseInfo.caseNumber}
            onChange={e => setCaseInfo(p => ({ ...p, caseNumber: e.target.value }))} />
        </div>
        <div className="case-field">
          <label>Court Name</label>
          <input type="text" placeholder="e.g. Delhi High Court" value={caseInfo.courtName}
            onChange={e => setCaseInfo(p => ({ ...p, courtName: e.target.value }))} />
        </div>
        <div className="case-field">
          <label>Date</label>
          <input type="date" value={caseInfo.date}
            onChange={e => setCaseInfo(p => ({ ...p, date: e.target.value }))} />
        </div>
        <div className="case-field">
          <label>Language</label>
          <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} disabled={isRecording}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </div>

      <div className="ht-grid">

        {/* ─── LEFT: Controls ─── */}
        <div className="ht-control-panel">

          {/* Recording Status */}
          <div className="ht-rec-status">
            <div className="ht-timer">
              {isRecording && !isPaused && <span className="rec-dot-live" />}
              <Clock size={18} />
              <span className="timer-value">{formatTime(elapsed)}</span>
            </div>
            <div className="ht-stats">
              <span>{entries.length} entries</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Waveform */}
          <WaveformVisualizer isActive={isRecording && !isPaused} analyserRef={analyserRef} />

          {/* Transport Controls */}
          <div className="ht-transport">
            {!isRecording ? (
              <button className="transport-btn start" onClick={handleStart}><Mic size={22} /> Start Recording</button>
            ) : (
              <>
                {isPaused ? (
                  <button className="transport-btn resume" onClick={handleResume}><Play size={22} /> Resume</button>
                ) : (
                  <button className="transport-btn pause" onClick={handlePause}><Pause size={22} /> Pause</button>
                )}
                <button className="transport-btn stop" onClick={handleStop}><StopCircle size={22} /> Stop</button>
              </>
            )}
            <button className="transport-btn reset" onClick={handleReset}><RotateCcw size={18} /></button>
          </div>

          {/* Speaker Selector */}
          <div className="ht-speaker-section">
            <label className="section-label"><User size={16} /> Active Speaker</label>
            <div className="speaker-grid">
              {SPEAKER_ROLES.map(role => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    className={`speaker-chip ${activeSpeaker === role.id ? 'active' : ''}`}
                    style={{ '--chip-color': role.color }}
                    onClick={() => setActiveSpeaker(role.id)}
                  >
                    <Icon size={14} /> {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Summary Button */}
          <button
            className={`btn-summarize ${isSummarizing ? 'loading' : ''}`}
            onClick={generateSummary}
            disabled={entries.length === 0 || isSummarizing}
          >
            {isSummarizing ? 'Analyzing...' : <><BarChart3 size={18} /> Generate AI Summary</>}
          </button>

        </div>

        {/* ─── RIGHT: Transcript / Summary ─── */}
        <div className="ht-output-panel">

          {/* Tabs */}
          <div className="ht-tabs">
            <button className={`ht-tab ${activeTab === 'transcript' ? 'active' : ''}`} onClick={() => setActiveTab('transcript')}>
              <FileText size={16} /> Live Transcript
            </button>
            <button className={`ht-tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
              <BarChart3 size={16} /> AI Summary
            </button>
          </div>

          {/* Content Area */}
          <div className="ht-content-area">
            {activeTab === 'transcript' ? (
              entries.length === 0 ? (
                <div className="ht-empty">
                  <Mic size={36} />
                  <h3>Ready to Record</h3>
                  <p>Select a speaker, press Start, and speak. Each statement will appear here with timestamps.</p>
                </div>
              ) : (
                <div className="ht-entries">
                  {entries.map(entry => {
                    const role = SPEAKER_ROLES.find(r => r.id === entry.speaker);
                    const Icon = role?.icon || MessageSquare;
                    return (
                      <div key={entry.id} className="ht-entry" style={{ '--entry-color': role?.color || '#64748b' }}>
                        <div className="entry-meta">
                          <span className="entry-time">{formatTime(entry.timestamp)}</span>
                          <span className="entry-speaker" style={{ color: role?.color }}>
                            <Icon size={13} /> {role?.label}
                          </span>
                          {entry.confidence && <span className="entry-conf">{entry.confidence}%</span>}
                        </div>
                        <p className="entry-text">{entry.text}</p>
                      </div>
                    );
                  })}
                  <div ref={transcriptEndRef} />
                </div>
              )
            ) : (
              isSummarizing ? (
                <div className="ht-empty">
                  <div className="typing-dots"><span /><span /><span /></div>
                  <p>AI is analyzing the hearing transcript...</p>
                </div>
              ) : !summary ? (
                <div className="ht-empty">
                  <BarChart3 size={36} />
                  <h3>No Summary Yet</h3>
                  <p>Record the hearing first, then click "Generate AI Summary" to get a comprehensive analysis.</p>
                </div>
              ) : (
                <div className="ht-summary-content" dangerouslySetInnerHTML={{ __html: summary }} />
              )
            )}
          </div>

          {/* Actions */}
          <div className="ht-actions">
            <button className="ht-act-btn secondary" onClick={handleCopy} disabled={entries.length === 0}>
              <Copy size={16} /> Copy
            </button>
            <button className="ht-act-btn primary" onClick={handlePrint} disabled={entries.length === 0}>
              <Download size={16} /> Print / PDF
            </button>
          </div>

          <div className="ht-disclaimer">
            <AlertTriangle size={13} />
            <span>AI transcription is approximate. Always verify against official court records.</span>
          </div>
        </div>
      </div>

      {toast && <div className="ht-toast">{toast}</div>}
    </div>
  );
};

export default HearingTranscription;
