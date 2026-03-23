import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, ShieldCheck, Plus, MessageSquare, Menu, X, Sparkles, Command, FileText, Scale, UploadCloud } from 'lucide-react';
import api from '../api';
import './AILegalAssistant.css';

const AILegalAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userQuery = input;
    const newMessages = [...messages, { id: Date.now(), type: 'user', text: userQuery }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    try {
      const res = await api.askAI(userQuery, messages);
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: res.answer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: "**System Alert:** The central intelligence servers are currently experiencing high latency or restricted access. Please check your connection or manually draft your queries."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewSession = () => {
    setMessages([{ id: Date.now(), type: 'bot', text: 'Context cleared. Establishing a secure, blank session. What is your legal inquiry?' }]);
    setSidebarOpen(false);
  };

  const formatText = (text) => {
    if (!text) return { __html: '' };

    // Process line by line for block-level elements
    const lines = text.split('\n');
    let html = '';
    let inUnorderedList = false;
    let inOrderedList = false;

    const closeOpenLists = () => {
      if (inUnorderedList) { html += '</ul>'; inUnorderedList = false; }
      if (inOrderedList) { html += '</ol>'; inOrderedList = false; }
    };

    const inlineFormat = (str) => str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="ai-inline-code">$1</code>');

    lines.forEach(line => {
      const trimmed = line.trim();

      // Horizontal rule
      if (/^---+$/.test(trimmed)) {
        closeOpenLists();
        html += '<hr class="ai-response-hr" />';
        return;
      }

      // H2 heading
      if (trimmed.startsWith('## ')) {
        closeOpenLists();
        html += `<h3 class="ai-response-h2">${inlineFormat(trimmed.slice(3))}</h3>`;
        return;
      }

      // H3 heading
      if (trimmed.startsWith('### ')) {
        closeOpenLists();
        html += `<h4 class="ai-response-h3">${inlineFormat(trimmed.slice(4))}</h4>`;
        return;
      }

      // H1 heading (# )
      if (trimmed.startsWith('# ')) {
        closeOpenLists();
        html += `<h2 class="ai-response-h1">${inlineFormat(trimmed.slice(2))}</h2>`;
        return;
      }

      // Unordered list item (- or *)
      if (/^[-*] /.test(trimmed)) {
        if (inOrderedList) { html += '</ol>'; inOrderedList = false; }
        if (!inUnorderedList) { html += '<ul class="ai-response-ul">'; inUnorderedList = true; }
        html += `<li>${inlineFormat(trimmed.slice(2))}</li>`;
        return;
      }

      // Ordered list item (1. 2. etc.)
      if (/^\d+\. /.test(trimmed)) {
        if (inUnorderedList) { html += '</ul>'; inUnorderedList = false; }
        if (!inOrderedList) { html += '<ol class="ai-response-ol">'; inOrderedList = true; }
        html += `<li>${inlineFormat(trimmed.replace(/^\d+\. /, ''))}</li>`;
        return;
      }

      // Empty line - close lists
      if (trimmed === '') {
        closeOpenLists();
        return;
      }

      // Regular paragraph
      closeOpenLists();
      html += `<p class="ai-response-p">${inlineFormat(trimmed)}</p>`;
    });

    closeOpenLists();
    return { __html: html };
  };


  // Click handler for suggestion cards
  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  return (
    <div className="ai-v3-container">
      
      {/* Background Ambience */}
      <div className="ai-bg-glow"></div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Left Sidebar Layout */}
      <aside className={`ai-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sh-brand">
            <Command size={24} className="text-cyan" /> Nyaya Engine
          </div>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <button onClick={handleNewSession} className="new-chat-btn">
          <Plus size={18} /> New Secure Session
        </button>

        <div className="session-list">
          <span className="section-label">Recent Inquiries</span>
          <button className="session-item">
            <MessageSquare size={16} /> Property Dispute Act...
          </button>
          <button className="session-item">
            <MessageSquare size={16} /> Drafting Mutual NDA...
          </button>
          <button className="session-item">
            <MessageSquare size={16} /> Consumer Rights Ref...
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="security-badge">
            <ShieldCheck size={18} className="text-green" /> 
            <span>E2E Encrypted</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Canvas */}
      <main className="ai-main-canvas">
        
        {/* Top Header */}
        <header className="canvas-header dark-glass">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="ch-info">
            <h2>Legal Assistant v4.0 <span className="beta-badge">BETA</span></h2>
            <p className="status-indicator">
              <span className="dot pulse"></span> AI Engine Online
            </p>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="chat-messages-scroll">
          
          {messages.length === 0 && (
            <div className="welcome-banner-v2 animate-fade-in-up">
              <div className="wb-icon-glow">
                <Sparkles size={40} className="text-cyan" />
              </div>
              <h1 className="wb-title">
                How can I <span className="text-gradient-cyan">analyze</span> your case?
              </h1>
              
              <div className="ai-suggestions-grid">
                <button className="suggestion-card" onClick={() => handleSuggestionClick("Can you draft a mutual NDA for me?")}>
                  <FileText size={24} className="text-purple" />
                  <div className="sc-text">
                    <h4>Draft Legal Notices</h4>
                    <p>NDAs, Retainers, Affidavits</p>
                  </div>
                </button>

                <button className="suggestion-card" onClick={() => handleSuggestionClick("What are my rights under the Consumer Protection Act?")}>
                  <Scale size={24} className="text-gold" />
                  <div className="sc-text">
                    <h4>Query Penal Codes</h4>
                    <p>Rights, Acts, and Sections</p>
                  </div>
                </button>

                <button className="suggestion-card" onClick={() => handleSuggestionClick("Analyze this uploaded encrypted document.")}>
                  <UploadCloud size={24} className="text-blue" />
                  <div className="sc-text">
                    <h4>Upload Documents</h4>
                    <p>Extract facts and insights</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.type}`}>
              
              {msg.type === 'bot' && (
                <div className="avatar bot-avatar"><Bot size={20} /></div>
              )}
              
              <div 
                className={`chat-bubble ${msg.type}`}
                dangerouslySetInnerHTML={formatText(msg.text)}
              />

              {msg.type === 'user' && (
                <div className="avatar user-avatar"><User size={20} /></div>
              )}

            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="avatar bot-avatar"><Bot size={20} /></div>
              <div className="chat-bubble bot is-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area */}
        <div className="canvas-footer">
          <form className="ai-input-form dark-glass" onSubmit={handleSend}>
            <input 
              type="text" 
              className="ai-input"
              placeholder="Ask a legal question or describe your dispute..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className={`ai-send-btn ${input.trim() ? 'active' : ''}`}
              disabled={!input.trim() || isTyping}
            >
              <Send size={20} />
            </button>
          </form>
          <div className="disclaimer-footer">
            Generative AI can make mistakes. For guaranteed accuracy, <a href="/find-lawyer">consult an advocate</a>.
          </div>
        </div>

      </main>

    </div>
  );
};

export default AILegalAssistant;
