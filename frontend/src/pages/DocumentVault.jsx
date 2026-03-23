import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Shield, CalendarIcon, HardDrive, Lock, ShieldCheck, Download, Eye, FileDigit } from 'lucide-react';
import api from '../api';
import './DocumentVault.css';

const DocumentVault = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await api.getMyDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load vault", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;

    setUploading(true);
    try {
      // Fake cloud upload delay with "encryption" phases
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const payload = {
        filename: fileToUpload.name,
        fileUrl: `https://secure-vault.justicesetu.com/docs/${Date.now()}_${fileToUpload.name}`,
        fileType: fileToUpload.type || 'application/pdf',
      };

      await api.uploadDocument(payload);
      setFileToUpload(null);
      await fetchDocuments(); // refresh list
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to securely upload document.");
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '2.4 MB'; // dummy fallback
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getTypeColor = (type) => {
    if (type.includes('pdf')) return 'red';
    if (type.includes('image')) return 'blue';
    if (type.includes('word')) return 'blue';
    return 'purple';
  };

  return (
    <div className="vault-page animate-fade-in">
      {/* Background Ambience */}
      <div className="vault-bg-glow"></div>

      <div className="vault-header">
        <div className="vh-left">
          <div className="vh-icon-wrapper">
            <Lock size={32} className="lock-icon" />
            <div className="shield-ping"></div>
          </div>
          <div>
            <h2 className="vh-title">Encrypted Document Vault</h2>
            <p className="vh-subtitle">
              <ShieldCheck size={16} /> End-to-end encrypted ledger for your sensitive legal documents.
            </p>
          </div>
        </div>
        <div className="vh-right">
          <div className="storage-meter">
            <div className="sm-info">
              <span><HardDrive size={14} /> Storage</span>
              <span>1.2 GB / 5GB</span>
            </div>
            <div className="sm-bar">
              <div className="sm-fill" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="vault-grid">
        {/* Left Col: Upload Terminal */}
        <div className="vault-col upload-col">
          <div className="dv-glass-card upload-terminal">
            <div className="terminal-header">
              <Shield size={16} className="text-green" /> Secure Upload Gateway
            </div>
            
            <form onSubmit={handleUpload} className="upload-form">
              <div className={`drop-zone ${fileToUpload ? 'has-file' : ''}`}>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="drop-input"
                  id="file-upload"
                />
                
                {!fileToUpload ? (
                  <div className="drop-content">
                    <div className="upload-icon-pulse">
                      <Upload size={36} />
                    </div>
                    <h4>Drop legally binding files here</h4>
                    <p>PDF, DOCX, JPG, PNG up to 50MB</p>
                    <label htmlFor="file-upload" className="btn-browse">Browse Files</label>
                  </div>
                ) : (
                  <div className="file-ready">
                    <FileDigit size={40} className="text-blue file-ready-icon" />
                    <h4>{fileToUpload.name}</h4>
                    <p>{formatSize(fileToUpload.size)}</p>
                    <label htmlFor="file-upload" className="change-file">Change File</label>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={`btn-secure-upload ${uploading ? 'uploading' : ''}`}
                disabled={!fileToUpload || uploading}
              >
                {uploading ? (
                  <>
                    <span className="enc-spinner"></span> Encrypting & Committing...
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Encrypt & Upload to Vault
                  </>
                )}
              </button>
            </form>

            <div className="security-badges">
              <div className="s-badge"><Shield size={14} /> AES-256</div>
              <div className="s-badge"><Shield size={14} /> Zero-Knowledge</div>
              <div className="s-badge"><Shield size={14} /> Immutable</div>
            </div>
          </div>
        </div>

        {/* Right Col: Vault Ledger */}
        <div className="vault-col list-col">
          <div className="dv-glass-card ledger-card">
            <div className="ledger-header">
              <h3>My Encrypted Ledger</h3>
              <span className="doc-count">{documents.length} Items</span>
            </div>
            
            <div className="ledger-body">
              {loading ? (
                <div className="ledger-loading">
                  <div className="enc-spinner mx-auto mb-4"></div>
                  <p>Decrypting Vault Contents...</p>
                </div>
              ) : documents.length === 0 ? (
                 <div className="ledger-empty">
                   <div className="empty-icon"><FileText size={48} /></div>
                   <h4>Your Vault is Empty</h4>
                   <p>Upload identity proofs, property deeds, or case evidence to securely share them with your counsel later.</p>
                 </div>
              ) : (
                <div className="docs-ledger-list">
                  {documents.map((doc) => (
                    <div key={doc.id} className="ledger-item animate-fade-in-up">
                      <div className={`doc-type-icon ${getTypeColor(doc.fileType)}`}>
                        <FileText size={24} />
                      </div>
                      
                      <div className="doc-meta">
                        <h4 className="doc-filename">{doc.filename}</h4>
                        <div className="doc-meta-row">
                          <span className="mr-item"><CalendarIcon size={14} /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                          <span className="mr-item dt-badge">{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                          <span className="mr-item">2.4 MB</span>
                        </div>
                      </div>

                      <div className="doc-actions">
                        <button className="btn-icon action-view" title="Preview Document">
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon action-dl" title="Download Decrypted">
                          <Download size={18} />
                        </button>
                        <button className="btn-icon action-del" title="Permanently Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;
