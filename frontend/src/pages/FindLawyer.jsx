import { useState, useMemo, useEffect } from 'react';
import { 
  Search, MapPin, Star, Sparkles, Filter, ChevronDown, Check, CheckCircle, Award, 
  Briefcase, ArrowRight, ShieldCheck, Mail, BarChart3, Clock, LayoutGrid, 
  List as ListIcon, Heart, Languages, Gavel, Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './FindLawyer.css';

const FindLawyer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filters & Sorting
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('Recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const data = await api.getLawyers();
        const formatted = data.map(l => {
          // Mock data enhancement for richer UI
          const idStr = String(l.id);
          const mockLangs = idStr.includes('1') ? ['English', 'Hindi'] : 
                            idStr.includes('2') ? ['English', 'Marathi', 'Hindi'] : ['English'];
          const successRate = 70 + (l.id * 3) % 28; // Mock 70-98%
          const casesWon = 50 + (l.id * 17) % 300;
          
          return {
            id: l.id,
            name: l.name,
            specialization: l.specialization || 'General Practice',
            experienceYears: l.experienceYears || (5 + (l.id % 20)),
            experience: `${l.experienceYears || (5 + (l.id % 20))} yrs`,
            location: l.location || 'Not Specified',
            rating: l.rating || 4.5,
            reviews: l.reviewsCount || Math.floor(Math.random() * 50) + 10,
            priceVal: l.consultationFee || 1000 + (l.id % 5)*500,
            price: `₹${l.consultationFee || 1000 + (l.id % 5)*500}`,
            image: l.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=0f172a&color=fff&size=250`,
            isVerified: l.isVerified !== undefined ? l.isVerified : true,
            languages: mockLangs,
            successRate,
            casesWon,
            raw: l
          };
        });
        setLawyers(formatted);
      } catch (err) {
        console.error("Failed to load lawyers", err);
        setTimeout(fetchLawyers, 3000); // Retry fallback
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const specialties = ['All', ...new Set(lawyers.map(l => l.specialization))];
  const locations = ['All', ...new Set(lawyers.map(l => l.location))];

  const filteredLawyers = useMemo(() => {
    let result = lawyers.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpec = specialtyFilter === 'All' || l.specialization === specialtyFilter;
      const matchLoc = locationFilter === 'All' || l.location === locationFilter;
      const matchRating = l.rating >= ratingFilter;
      return matchSearch && matchSpec && matchLoc && matchRating;
    });

    // Sorting
    switch (sortBy) {
      case 'Rating: High to Low': result.sort((a, b) => b.rating - a.rating); break;
      case 'Experience: High to Low': result.sort((a, b) => b.experienceYears - a.experienceYears); break;
      case 'Fee: Low to High': result.sort((a, b) => a.priceVal - b.priceVal); break;
      case 'Fee: High to Low': result.sort((a, b) => b.priceVal - a.priceVal); break;
      case 'Highest Success Rate': result.sort((a, b) => b.successRate - a.successRate); break;
      default: /* Recommended */ break;
    }

    return result;
  }, [searchTerm, specialtyFilter, locationFilter, ratingFilter, sortBy, lawyers]);

  const handleBook = (lawyer) => {
    navigate('/consultation-booking', { state: { selectedLawyer: lawyer.raw } });
  };

  return (
    <div className="directory-page animate-fade-in">
      
      {/* ─── Immersive Search Hero ─── */}
      <section className="directory-hero">
        <div className="dh-bg-mesh">
           <div className="dh-blob color-1"></div>
           <div className="dh-blob color-2"></div>
        </div>
        
        <div className="container dh-content">
          <div className="dh-badge">
            <Sparkles size={16} /> <span className="text-gradient">India's Premium Legal Network</span>
          </div>
          <h1 className="dh-title">Find Your Perfect <br/><span className="text-highlight">Legal Expert.</span></h1>
          <p className="dh-subtitle">Connect with top-rated, Bar Council verified advocates across India. <br/>Filter by expertise, location, and proven track records.</p>
          
          <div className="dh-search-glass">
            <div className="search-input-group">
              <Search className="search-icon" size={24} />
              <input 
                type="text" 
                placeholder="Search by name, expertise, or legal issue (e.g. Divorce, Property)..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <button className="btn-search-glow">Search Experts</button>
          </div>
          
          <div className="dh-quick-tags">
            <span className="tags-label">Popular Searches:</span>
            {['Family Law', 'Corporate', 'Criminal Defense', 'Property'].map(tag => (
              <button key={tag} onClick={() => setSpecialtyFilter(tag)} className={specialtyFilter === tag ? 'active' : ''}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Directory Area ─── */}
      <section className="directory-main-section">
        <div className="container dir-layout">
          
          {/* Mobile Filter Toggle */}
          <button className="mobile-filter-btn" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <Filter size={18} /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* ─── LEFT: Advanced Filters ─── */}
          <aside className={`dir-sidebar ${showMobileFilters ? 'show' : ''}`}>
            <div className="dir-sidebar-sticky">
              
              <div className="filter-header">
                <h3><Filter size={18}/> Filters</h3>
                {(specialtyFilter !== 'All' || locationFilter !== 'All' || ratingFilter > 0) && (
                  <button className="btn-clear" onClick={() => {
                    setSpecialtyFilter('All'); setLocationFilter('All'); setRatingFilter(0);
                  }}>Clear all</button>
                )}
              </div>

              {/* Specialization */}
              <div className="filter-group">
                <label className="filter-label"><Scale size={16}/> Practice Area</label>
                <div className="radio-pill-grid">
                  {specialties.slice(0, 7).map(spec => (
                    <button 
                      key={spec}
                      className={`radio-pill ${specialtyFilter === spec ? 'active' : ''}`}
                      onClick={() => setSpecialtyFilter(spec)}
                    >
                      {spec}
                    </button>
                  ))}
                  {specialties.length > 7 && <button className="radio-pill more">+{specialties.length - 7} More</button>}
                </div>
              </div>

              {/* Location */}
              <div className="filter-group">
                <label className="filter-label"><MapPin size={16}/> City / Court Location</label>
                <div className="select-wrapper">
                  <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>
              </div>

              {/* Minimum Rating Slider */}
              <div className="filter-group">
                <label className="filter-label"><Star size={16}/> Minimum Peer Rating</label>
                <div className="slider-box">
                  <div className="slider-val">{ratingFilter.toFixed(1)}+ <Star size={14} fill="#f59e0b" color="#f59e0b" /></div>
                  <input 
                    type="range" min="0" max="5" step="0.5" 
                    value={ratingFilter} 
                    onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                    className="premium-slider"
                  />
                  <div className="slider-marks"><span>Any</span><span>5.0</span></div>
                </div>
              </div>

            </div>
          </aside>

          {/* ─── RIGHT: Results & Toolbar ─── */}
          <main className="dir-results-area">
            
            {/* Toolbar */}
            <div className="dir-toolbar panel-glass">
              <div className="toolbar-stats">
                <span className="stats-highlight">{filteredLawyers.length}</span> legal experts found
              </div>
              <div className="toolbar-controls">
                
                <div className="sort-dropdown select-wrapper">
                  <span className="sort-label">Sort by:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {['Recommended', 'Highest Success Rate', 'Rating: High to Low', 'Experience: High to Low', 'Fee: Low to High', 'Fee: High to Low'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" size={14} />
                </div>

                <div className="view-toggle">
                  <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={18}/></button>
                  <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><ListIcon size={18}/></button>
                </div>

              </div>
            </div>

            {/* Results Grid/List */}
            {loading ? (
              <div className="dir-loading">
                <div className="neuro-spinner"></div>
                <p>Curating top legal talent...</p>
              </div>
            ) : filteredLawyers.length === 0 ? (
              <div className="dir-empty panel-glass">
                <div className="empty-icon"><Search size={40} /></div>
                <h3>No experts found matching your criteria</h3>
                <p>Try adjusting your search terms or clearing some filters.</p>
                <button className="btn-solid-primary mt-4" onClick={() => {setSearchTerm(''); setSpecialtyFilter('All'); setLocationFilter('All'); setRatingFilter(0);}}>Reset Filters</button>
              </div>
            ) : (
              <div className={`dir-card-container ${viewMode}`}>
                {filteredLawyers.map(lawyer => (
                  <div key={lawyer.id} className="lawyer-card panel-glass hover-lift">
                    
                    {/* Top Row (Avatar + Badges) */}
                    <div className="lc-top">
                      <div className="lc-avatar-wrapper">
                        <img src={lawyer.image} alt={lawyer.name} className="lc-avatar" />
                        {lawyer.isVerified && (
                          <div className="lc-verified" title="Bar Council Verified">
                            <ShieldCheck size={14} />
                          </div>
                        )}
                      </div>
                      <div className="lc-top-info">
                        <h2 className="lc-name">{lawyer.name}</h2>
                        <h4 className="lc-specialty">{lawyer.specialization}</h4>
                        
                        <div className="lc-badges">
                          {lawyer.rating >= 4.7 && <span className="badge-glow-gold"><Award size={12}/> Top Rated</span>}
                          {lawyer.successRate >= 85 && <span className="badge-glow-green"><Gavel size={12}/> {lawyer.successRate}% Success</span>}
                        </div>
                      </div>
                      <button className="btn-favorite"><Heart size={20} /></button>
                    </div>

                    {/* Middle Row (Stats Grid) */}
                    <div className="lc-stats-grid">
                      <div className="lc-stat">
                        <Star className="stat-icon yellow" size={16} fill="currentColor" />
                        <div><strong>{lawyer.rating}</strong><span>({lawyer.reviews})</span></div>
                      </div>
                      <div className="lc-stat">
                        <Briefcase className="stat-icon blue" size={16} />
                        <div><strong>{lawyer.experienceYears}</strong><span>Years Exp.</span></div>
                      </div>
                      <div className="lc-stat">
                        <MapPin className="stat-icon gray" size={16} />
                        <div><strong>{lawyer.location}</strong><span>Court</span></div>
                      </div>
                      <div className="lc-stat">
                        <CheckCircle className="stat-icon green" size={16} />
                        <div><strong>{lawyer.casesWon}+</strong><span>Cases Won</span></div>
                      </div>
                    </div>

                    <div className="lc-langs">
                      <Languages size={14} /> Speaks: {lawyer.languages.join(', ')}
                    </div>

                    <div className="lc-divider"></div>

                    {/* Bottom Row (Actions & Price) */}
                    <div className="lc-bottom">
                      <div className="lc-price-col">
                        <span className="price-label">Consultation Fee</span>
                        <div className="price-amount">{lawyer.price} <span className="price-unit">/ session</span></div>
                      </div>
                      
                      <div className="lc-actions-col">
                        <button className="btn-action-outline analytics" onClick={() => navigate(`/lawyer-analytics`, { state: { lawyer: lawyer.raw } })}>
                          <BarChart3 size={16}/> Analytics
                        </button>
                        <button className="btn-action-outline" onClick={() => navigate(`/lawyer-profile/${lawyer.id}`, { state: { lawyer } })}>
                          Profile
                        </button>
                        <button className="btn-action-solid" onClick={() => handleBook(lawyer)}>
                          Book Now
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default FindLawyer;
