import { useState, useEffect } from 'react';
import { AlertOctagon, MapPin, Send, ShieldAlert, PhoneCall, X, Loader, CheckCircle, Navigation, Mic, AlertTriangle, MessageCircle, Map as MapIcon } from 'lucide-react';
import './EmergencySOS.css';

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  // States: idle -> location_prompt -> configuring -> radar_search -> live_session
  const [status, setStatus] = useState('idle'); 
  const [location, setLocation] = useState(null);
  const [recording, setRecording] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customIssue, setCustomIssue] = useState('');
  const [lawyer, setLawyer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const issueTags = [
    "Police Detainment",
    "Domestic Violence",
    "Accident/Injury",
    "Harassment",
    "Illegal Eviction",
    "Other Threat"
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const startEmergencyProtocol = () => {
    setIsOpen(true);
    setStatus('location_prompt');
    
    // Automatically grab location for realism
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
            accuracy: pos.coords.accuracy.toFixed(0)
          });
          setStatus('configuring');
        },
        (err) => {
          console.error(err);
          setLocation({ lat: '28.6139', lng: '77.2090', accuracy: 'Estimate', error: true }); // Fallback to Delhi coordinates
          setStatus('configuring');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocation({ lat: '28.6139', lng: '77.2090', accuracy: 'Estimate', error: true });
      setStatus('configuring');
    }
  };

  const handleBroadcast = () => {
    setStatus('radar_search');
    
    // Simulate finding a lawyer via nearby radar
    setTimeout(() => {
      setLawyer({
        name: 'Adv. Vikram Singh',
        specialty: 'Criminal Defense & Rights',
        phone: '+91 98765 43210',
        distance: '2.4 km away',
        eta: '4 mins'
      });
      setStatus('live_session');
      
      // Auto-trigger a message from the assigned lawyer
      setTimeout(() => {
        setChatMessages([
          { sender: 'lawyer', text: 'I have received your SOS and GPS coordinates. Are you in immediate physical danger? Do I need to dispatch local authorities?' }
        ]);
      }, 1500);

    }, 3500);
  };

  const closeSOS = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setLocation(null);
      setSelectedTags([]);
      setCustomIssue('');
      setLawyer(null);
      setRecording(false);
      setChatMessages([]);
    }, 400);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`sos-fab-ultra ${isOpen ? 'hidden' : ''}`}
        onClick={startEmergencyProtocol}
        aria-label="Emergency Legal Help"
      >
        <div className="sos-fab-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
        </div>
        <AlertOctagon size={28} />
        <span>SOS</span>
      </button>

      {/* Emergency Modal Overlay */}
      <div className={`sos-overlay-ultra ${isOpen ? 'active' : ''}`}>
        <div className="sos-modal-ultra animate-slide-up">
          
          <button className="sos-close-btn" onClick={closeSOS}>
            <X size={24} />
          </button>

          {/* ----- STATE 1: LOCATION PROMPT ----- */}
          {status === 'location_prompt' && (
            <div className="sos-state-view text-center">
              <div className="sos-radar-loader">
                <Navigation size={40} className="text-red pulse-fast" />
                <div className="radar-sweep"></div>
              </div>
              <h2 className="sos-title-red mt-4">Acquiring Sat-Link...</h2>
              <p className="sos-subtitle">Pinpointing your exact GPS coordinates for emergency dispatch.</p>
            </div>
          )}

          {/* ----- STATE 2: CONFIGURING ALERT ----- */}
          {status === 'configuring' && (
            <div className="sos-state-view fade-in">
              <div className="sos-header-compact">
                <ShieldAlert size={28} className="text-red pulse-slow" />
                <div>
                  <h2 className="sos-title-red">Emergency Protocol</h2>
                  <p className="sos-subtitle">Secure broadcast to nearest pro-bono counsel.</p>
                </div>
              </div>

              <div className="sos-map-preview">
                {/* Fake Map Frame */}
                {location && !location.error ? (
                   <iframe 
                      title="sos-map"
                      width="100%" 
                      height="120" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed&theme=dark`}
                      style={{ borderRadius: '12px', opacity: 0.8, filter: 'contrast(1.2) sepia(1) hue-rotate(-50deg) saturate(3)' }}
                   ></iframe>
                ) : (
                  <div className="map-fallback">
                    <MapIcon size={32} />
                    <span>Using cellular triangulation</span>
                  </div>
                )}
                
                <div className="map-overlay-data">
                  <div className="mo-data-pill"><MapPin size={12}/> Live Track Active</div>
                  {location?.accuracy && <div className="mo-data-pill glow-red">Acc: ±{location.accuracy}m</div>}
                </div>
              </div>

              <div className="sos-quick-tags">
                <label>Nature of Emergency (Select multiple):</label>
                <div className="tags-grid">
                  {issueTags.map(tag => (
                    <button 
                      key={tag} 
                      className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sos-audio-row">
                <button 
                  className={`btn-record-audio ${recording ? 'recording' : ''}`}
                  onClick={() => setRecording(!recording)}
                >
                  <Mic size={18} /> {recording ? 'Recording Environment...' : 'Record Ambient Audio'}
                </button>
              </div>

              <button className="btn-broadcast-mega" onClick={handleBroadcast}>
                <AlertTriangle size={24} />
                BROADCAST SOS ALERT
              </button>
            </div>
          )}

          {/* ----- STATE 3: RADAR SEARCH ----- */}
          {status === 'radar_search' && (
            <div className="sos-state-view text-center fade-in">
              <div className="mega-radar-bg">
                <div className="mr-dot center-dot"></div>
                <div className="mr-circle mr-1"></div>
                <div className="mr-circle mr-2"></div>
                <div className="mr-circle mr-3"></div>
                <div className="mr-sweeper"></div>
                {/* Simulated nearby lawyers pinging */}
                <div className="mr-dot fake-lawyer l1"></div>
                <div className="mr-dot fake-lawyer l2"></div>
              </div>
              <h2 className="sos-title-red mt-6">Pinging Local Network</h2>
              <p className="sos-subtitle">Encrypting coordinates... Handshaking with nearest available defense counsel...</p>
              
              <div className="encryption-logs">
                <div>[SYSTEM] 2048-bit RSA Encryption active.</div>
                <div>[SYSTEM] Bypassing localized network throttles.</div>
                <div>[NETWORK] 3 advocates matched in 5km radius.</div>
              </div>
            </div>
          )}

          {/* ----- STATE 4: LIVE SESSION ----- */}
          {status === 'live_session' && lawyer && (
            <div className="sos-state-view live-view fade-in">
              
              <div className="live-header">
                <div className="live-pulse-indicator">
                  <div className="lpi-dot"></div> LIVE LINK ESTABLISHED
                </div>
              </div>

              <div className="assigned-card-premium">
                <div className="acp-left">
                  <div className="acp-avatar">{lawyer.name.charAt(0)}</div>
                </div>
                <div className="acp-mid">
                  <h4>{lawyer.name}</h4>
                  <p className="text-gold">{lawyer.specialty}</p>
                  <p className="acp-meta">
                    <MapPin size={12}/> {lawyer.distance} • {lawyer.eta} ETA
                  </p>
                </div>
                <div className="acp-right">
                  <a href={`tel:${lawyer.phone}`} className="btn-call-emergency">
                    <PhoneCall size={20} />
                  </a>
                </div>
              </div>

              {/* Secure Live Chat Window */}
              <div className="secure-chat-window">
                <div className="scw-header">
                  <ShieldAlert size={14} className="text-green" /> End-to-End Encrypted Session
                </div>
                <div className="scw-body">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`scw-bubble ${msg.sender}`}>
                      {msg.text}
                    </div>
                  ))}
                  {chatMessages.length === 1 && (
                    <div className="scw-bubble system">
                      Advocate {lawyer.name.split(' ')[1]} has received your GPS pin and audio snippets.
                    </div>
                  )}
                </div>
                <div className="scw-input-area">
                  <input type="text" placeholder="Type a discrete reply..." className="scw-input" />
                  <button className="scw-send"><Send size={18} /></button>
                </div>
              </div>

              <button className="btn-resolve-sos" onClick={closeSOS}>
                RESOLVE & CLOSE ENDPOINT
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EmergencySOS;
