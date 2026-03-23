import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Import public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import KnowledgeHub from './pages/KnowledgeHub';
import FindLawyer from './pages/FindLawyer';
import AILegalAssistant from './pages/AILegalAssistant';
import ConsultationBooking from './pages/ConsultationBooking';
import Payment from './pages/Payment';
import LawyerProfileSetup from './pages/LawyerProfileSetup';
import LawyerProfileView from './pages/LawyerProfileView';
import CaseTracker from './pages/CaseTracker';
import DocumentGenerator from './pages/DocumentGenerator';
import CompensationCalculator from './pages/CompensationCalculator';
import VoiceFIR from './pages/VoiceFIR';
import HearingTranscription from './pages/HearingTranscription';
import LawyerAnalytics from './pages/LawyerAnalytics';

// Import dashboards
import { CitizenDashboard, CitizenLayout } from './pages/CitizenDashboard';
import { LawyerDashboard, LawyerLayout } from './pages/LawyerDashboard';
import { AdminPanel, AdminLayout } from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import AdminVerifications from './pages/AdminVerifications';
import AdminLogs from './pages/AdminLogs';
import { 
  CaseManagement, Clients, ConsultationRequests, 
  Documents, DocumentLocker
} from './pages/DashboardSubPages';
import ProfileSettings from './pages/ProfileSettings';
import EmergencySOS from './components/EmergencySOS';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Standard Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="knowledge-hub" element={<KnowledgeHub />} />
          <Route path="find-lawyer" element={<FindLawyer />} />
          <Route path="ai-legal-assistant" element={<AILegalAssistant />} />
          <Route path="case-tracking" element={<CaseTracker />} />
          <Route path="consultation-booking" element={<ConsultationBooking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="lawyer-setup" element={<LawyerProfileSetup />} />
          <Route path="lawyer-profile/:id" element={<LawyerProfileView />} />
          <Route path="document-generator" element={<DocumentGenerator />} />
          <Route path="compensation-calculator" element={<CompensationCalculator />} />
          <Route path="voice-fir" element={<VoiceFIR />} />
          <Route path="hearing-transcription" element={<HearingTranscription />} />
          <Route path="lawyer-analytics" element={<LawyerAnalytics />} />
        </Route>

        {/* Citizen Dashboard Routes */}
        <Route path="/citizen-dashboard" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="consultations" element={<ConsultationRequests />} />
          <Route path="documents" element={<DocumentLocker />} />
          <Route path="document-generator" element={<DocumentGenerator />} />
          <Route path="compensation-calculator" element={<CompensationCalculator />} />
          <Route path="voice-fir" element={<VoiceFIR />} />
          <Route path="hearing-transcription" element={<HearingTranscription />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="*" element={<GenericFallback />} />
        </Route>

        {/* Lawyer Dashboard Routes */}
        <Route path="/lawyer-dashboard" element={<LawyerLayout />}>
          <Route index element={<LawyerDashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="schedule" element={<ConsultationRequests />} />
          <Route path="payments" element={<GenericFallback title="Payments & Revenue" />} />
          <Route path="document-generator" element={<DocumentGenerator />} />
          <Route path="compensation-calculator" element={<CompensationCalculator />} />
          <Route path="voice-fir" element={<VoiceFIR />} />
          <Route path="hearing-transcription" element={<HearingTranscription />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="*" element={<GenericFallback />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPanel />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="verifications" element={<AdminVerifications />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="*" element={<GenericFallback title="Admin Module" />} />
        </Route>
      </Routes>
      <EmergencySOS />
    </Router>
  );
}

const GenericFallback = ({ title = "Under Development" }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
    <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
      <h2 style={{ marginBottom: '16px', color: 'var(--navy-blue)' }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>This section is part of the migrated React framework and will be functional soon!</p>
    </div>
  </div>
);

export default App;
