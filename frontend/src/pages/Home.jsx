import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Search, Users, FileText, ArrowRight, Shield, ChevronRight, CheckCircle, Star, PlayCircle, Lock, FileSignature, Calculator, Mic, Headphones } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/ai-legal-assistant', { state: { initialQuery: searchQuery } });
    }
  };

  return (
    <div className="home-v4">
      
      {/* 1. Split Enterprise Hero */}
      <section className="hero-split">
        <div className="hero-bg-lights"></div>
        <div className="container split-container">
          
          {/* Left Text Column */}
          <div className="hero-left animate-fade-in-up">
            <div className="hero-trust-badge">
              <span className="live-dot pulse-green"></span> Trusted by 10,000+ Citizens
            </div>
            
            <h1 className="hero-title-left">
              Justice, Simplified for Every <span className="text-highlight-gold">Indian Citizen.</span>
            </h1>
            
            <p className="hero-desc-left">
              The all-in-one legal intelligence platform. Connect with elite Bar Council verified advocates, resolve queries with our AI engine, and track your active court cases in real-time.
            </p>

            <div className="hero-cta-group">
              <Link to="/find-lawyer" className="btn-primary-solid text-lg">
                Find a Lawyer <ArrowRight size={20} />
              </Link>
              <button className="btn-secondary-outline text-lg">
                <PlayCircle size={20} className="text-blue" /> Watch Demo
              </button>
            </div>

            <div className="hero-features-list">
              <span className="hfl-item"><CheckCircle size={16} className="text-green"/> 256-bit Document Vault</span>
              <span className="hfl-item"><CheckCircle size={16} className="text-green"/> AI Case Analysis</span>
              <span className="hfl-item"><CheckCircle size={16} className="text-green"/> Live E-Courts Sync</span>
            </div>
          </div>

          {/* Right Visual Column (CSS Composite) */}
          <div className="hero-right animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="hero-composite">
              
              {/* Back Mesh */}
              <div className="composite-bg-mesh"></div>
              
              {/* Floating Element 1: AI Chat */}
              <div className="float-card fc-1 dark-glass">
                <div className="fc-header">
                  <Bot size={18} className="text-blue" />
                  <span>AI Legal Engine</span>
                </div>
                <div className="fc-body">
                  <div className="fc-chat user-chat">How do I file for mutual divorce?</div>
                  <div className="fc-chat ai-chat">In India, under Section 13B of the HMA, you must file a joint petition...</div>
                </div>
              </div>

              {/* Floating Element 2: Assigned Lawyer */}
              <div className="float-card fc-2 dark-glass">
                <div className="fc-header">
                  <Users size={18} className="text-gold" />
                  <span>Lead Counsel Assigned</span>
                </div>
                <div className="fc-body lawyer-mini">
                  <div className="lm-avatar">A</div>
                  <div className="lm-info">
                    <h4>Adv. R.K. Sharma</h4>
                    <p>High Court of Delhi • <Star size={12} className="text-gold fill-gold" /> 4.9</p>
                  </div>
                </div>
              </div>

              {/* Floating Element 3: Case Tracking Status */}
              <div className="float-card fc-3 dark-glass">
                <div className="fc-header">
                  <Search size={18} className="text-green" />
                  <span>Case CVR-8492</span>
                </div>
                <div className="fc-body tracker-mini">
                  <div className="tm-step">
                    <span className="tm-dot active"></span>
                    <p>Next Hearing: <b>Oct 24</b></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* 2. Interactive AI Search Strip */}
      <section className="ai-search-strip">
        <div className="container">
          <div className="search-strip-glass">
            <div className="strip-text">
              <h3>Have a quick legal question?</h3>
              <p>Type it below and let our AI engine analyze it instantly.</p>
            </div>
            <form className="strip-form" onSubmit={handleSearchSubmit}>
              <div className="strip-input-wrap">
                <Bot className="strip-icon" size={24} />
                <input 
                  type="text" 
                  placeholder="E.g., What are my rights in a rental dispute?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="strip-input"
                />
              </div>
              <button type="submit" className="strip-btn glow-btn-gold">Ask AI</button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Sleek Modern Features Grid */}
      <section id="services" className="sleek-features-section">
        <div className="container">
          <div className="section-header-compact">
            <h2 className="heading-compact">A Complete <span className="text-highlight-gold">Legal Ecosystem</span></h2>
            <p>We provide enterprise-grade tools to empower citizens and lawyers alike.</p>
          </div>
          
          <div className="features-grid-v4">
            
            <div className="feature-block fb-dark">
              <div className="fb-icon bg-blue-alpha"><Users size={28} className="text-blue" /></div>
              <h3>Elite Lawyer Directory</h3>
              <p>Connect with top-rated, Bar Council verified advocates. Filter by specialization, language, and book secure video consultations.</p>
              <Link to="/find-lawyer" className="fb-link hover-blue">Browse Directory <ChevronRight size={16}/></Link>
            </div>

            <div className="feature-block fb-dark">
              <div className="fb-icon bg-green-alpha"><Search size={28} className="text-green" /></div>
              <h3>Real-Time Case Tracking</h3>
              <p>Sync your CVR number with E-Courts. Get instant WhatsApp alerts for hearing dates and live ledger updates.</p>
              <Link to="/case-tracking" className="fb-link hover-green">Track Case <ChevronRight size={16}/></Link>
            </div>

            <div className="feature-block fb-dark">
              <div className="fb-icon bg-purple-alpha"><FileText size={28} className="text-purple" /></div>
              <h3>Automated Document Drafting</h3>
              <p>Generate standard NDAs, Rental Agreements, and Legal Notices in seconds using our compliant AI drafting tool.</p>
              <Link to="/ai-legal-assistant" className="fb-link hover-purple">Draft Document <ChevronRight size={16}/></Link>
            </div>

            <div className="feature-block fb-dark">
              <div className="fb-icon bg-gold-alpha"><Lock size={28} className="text-gold" /></div>
              <h3>Encrypted Evidence Vault</h3>
              <p>Store your sensitive contracts and case evidence in our 256-bit end-to-end encrypted cloud locker. Assured privacy.</p>
              <Link to="/login" className="fb-link hover-gold">Open Vault <ChevronRight size={16}/></Link>
            </div>

            <div className="feature-block fb-dark">
              <div className="fb-icon" style={{ background: 'rgba(239,68,68,0.12)' }}><FileSignature size={28} style={{ color: '#ef4444' }} /></div>
              <h3>Legal Document Generator</h3>
              <p>Instantly create FIR Drafts, Affidavits, and Complaint Letters with proper legal language. Fill a simple form, preview live, and download as PDF.</p>
              <Link to="/document-generator" className="fb-link" style={{ color: '#ef4444' }}>Generate Document <ChevronRight size={16}/></Link>
            </div>
            
            <div className="feature-block fb-dark">
              <div className="fb-icon" style={{ background: 'rgba(245,158,11,0.12)' }}><Calculator size={28} style={{ color: '#f59e0b' }} /></div>
              <h3>Accident Comp. Calculator</h3>
              <p>Estimate Motor Accident Compensation as per Supreme Court guidelines. Adjust age, income, and disability for instant, accurate reports via PDF.</p>
              <Link to="/compensation-calculator" className="fb-link" style={{ color: '#f59e0b' }}>Calculate Now <ChevronRight size={16}/></Link>
            </div>
            
            <div className="feature-block fb-dark">
              <div className="fb-icon" style={{ background: 'rgba(16,185,129,0.12)' }}><Mic size={28} style={{ color: '#10b981' }} /></div>
              <h3>AI Voice FIR System</h3>
              <p>Speak your complaint in your native language (Hindi, Marathi, etc.). Our Legal AI instantly translates and drafts a formal Police FIR for submission.</p>
              <Link to="/voice-fir" className="fb-link" style={{ color: '#10b981' }}>Start Recording <ChevronRight size={16}/></Link>
            </div>

            <div className="feature-block fb-dark">
              <div className="fb-icon" style={{ background: 'rgba(168,85,247,0.12)' }}><Headphones size={28} style={{ color: '#a855f7' }} /></div>
              <h3>AI Hearing Transcription</h3>
              <p>Live-transcribe court proceedings with speaker labels, timestamps, and AI-generated summaries with legal analysis of key points discussed.</p>
              <Link to="/hearing-transcription" className="fb-link" style={{ color: '#a855f7' }}>Start Transcribing <ChevronRight size={16}/></Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Elegant Onboarding Workflow */}
      <section id="about" className="workflow-section">
        <div className="container">
          <div className="workflow-container dark-glass">
            
            <div className="workflow-text">
              <h2>Resolving Disputes, <br/>Three Steps at a Time.</h2>
              <p>We've stripped away the complexity of the Indian legal system. No more endless paperwork or opaque lawyer fees.</p>
              <Link to="/signup" className="btn-primary-solid" style={{marginTop: '20px'}}>Create Free Account</Link>
            </div>

            <div className="workflow-steps">
              <div className="w-step">
                <div className="w-icon">1</div>
                <div className="w-info">
                  <h4>Register Securely</h4>
                  <p>Create your encrypted identity on JusticeSetu via your phone.</p>
                </div>
              </div>
              <div className="w-step">
                <div className="w-icon">2</div>
                <div className="w-info">
                  <h4>Analyze & Consult</h4>
                  <p>Use AI to understand your issue, then book an expert instantly.</p>
                </div>
              </div>
              <div className="w-step">
                <div className="w-icon">3</div>
                <div className="w-info">
                  <h4>Resolve & Track</h4>
                  <p>Manage documents, track case history, and achieve justice.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
