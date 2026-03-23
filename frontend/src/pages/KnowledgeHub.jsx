import { useState, useEffect } from 'react';
import { Search, BookOpen, FileText, Video, ChevronRight, Bookmark, ArrowUpRight, Scale, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './KnowledgeHub.css';

const KnowledgeHub = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="knowledge-hub-page animate-fade-in">
      
      {/* Immersive Background */}
      <div className="kh-bg-glow">
        <div className="kh-orb kh-orb-1"></div>
        <div className="kh-orb kh-orb-2"></div>
      </div>

      <div className="kh-container">
        
        {/* Dynamic Header */}
        <section className="kh-hero">
          <div className="kh-hero-content">
            <div className="kh-badge"><Sparkles size={16} /> Beta Library 4.0</div>
            <h1 className="kh-title">
              Legal <span className="text-gradient-purple">Knowledge</span> Hub
            </h1>
            <p className="kh-subtitle">
              Explore our comprehensive, AI-indexed library of legal resources, articles, rights, and regulatory guides.
            </p>
            
            <div className="kh-search-wrapper">
              <Search className="kh-search-icon" size={24} />
              <input 
                type="text" 
                placeholder="Search penal codes, property laws, or basic rights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="kh-search-input"
              />
              <button className="kh-search-btn">Search Library</button>
            </div>
          </div>
        </section>

        {/* Floating Metrics */}
        <div className="kh-metrics-grid animate-fade-in-up">
          <div className="kh-metric-card">
            <BookOpen size={24} className="text-blue" />
            <div>
              <h3>5,400+</h3>
              <p>Legal Articles</p>
            </div>
          </div>
          <div className="kh-metric-card">
            <Scale size={24} className="text-gold" />
            <div>
              <h3>12,000+</h3>
              <p>Case Precedents</p>
            </div>
          </div>
          <div className="kh-metric-card">
            <Shield size={24} className="text-green" />
            <div>
              <h3>100%</h3>
              <p>Verified by Bar Council</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="kh-section">
          <div className="kh-section-header">
            <h2>Browse Categories</h2>
            <Link to="#" className="kh-view-all">View All <ArrowUpRight size={18} /></Link>
          </div>
          
          <div className="kh-categories-grid">
            <div className="kh-cat-card card-purple">
              <div className="cat-icon-wrap"><BookOpen size={32} /></div>
              <h3>Fundamental Rights</h3>
              <p>Understand your constitutional rights, duties, and protections as a citizen of the state.</p>
              <div className="cat-footer">
                <span className="cat-count">240 Articles</span>
                <button className="cat-btn"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="kh-cat-card card-blue">
              <div className="cat-icon-wrap"><FileText size={32} /></div>
              <h3>Property & Land Law</h3>
              <p>Comprehensive guides on property disputes, RERA registration, and inheritance rights.</p>
              <div className="cat-footer">
                <span className="cat-count">185 Guides</span>
                <button className="cat-btn"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="kh-cat-card card-green">
              <div className="cat-icon-wrap"><Video size={32} /></div>
              <h3>Video Masterclasses</h3>
              <p>Visual, step-by-step explanations of complex legal procedures by top-tier advocates.</p>
              <div className="cat-footer">
                <span className="cat-count">45 Tutorials</span>
                <button className="cat-btn"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles - List styling */}
        <section className="kh-section">
          <div className="kh-section-header">
            <h2>Trending Resources</h2>
          </div>
          
          <div className="kh-articles-list">
            
            <div className="kh-article-row">
              <div className="ar-icon"><Bookmark size={20} className="text-gold" /></div>
              <div className="ar-content">
                <div className="ar-meta"><span>By JusticeSetu Editorial</span> • <span>5 min read</span></div>
                <h4>How to file a Consumer Court Complaint online</h4>
                <p>A complete checklist of documents and steps required to file a grievance against a vendor.</p>
              </div>
              <button className="btn-read-more">Read <ChevronRight size={16} /></button>
            </div>

            <div className="kh-article-row">
              <div className="ar-icon"><Bookmark size={20} className="text-purple" /></div>
              <div className="ar-content">
                <div className="ar-meta"><span>By Adv. M. Desai</span> • <span>12 min read</span></div>
                <h4>Understanding the New Criminal Laws (BNS, BNSS, BSA)</h4>
                <p>An in-depth comparison of the old IPC/CrPC framework vs the newly implemented Bharatiya Nyaya Sanhita.</p>
              </div>
              <button className="btn-read-more">Read <ChevronRight size={16} /></button>
            </div>

            <div className="kh-article-row">
              <div className="ar-icon"><Bookmark size={20} className="text-blue" /></div>
              <div className="ar-content">
                <div className="ar-meta"><span>By Legal Cell</span> • <span>8 min read</span></div>
                <h4>Navigating Divorce and Alimony in India</h4>
                <p>Key legal provisions, mutual consent timelines, and financial settlement frameworks.</p>
              </div>
              <button className="btn-read-more">Read <ChevronRight size={16} /></button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default KnowledgeHub;
