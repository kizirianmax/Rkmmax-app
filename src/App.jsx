import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider.jsx';
import AuthGate from './auth/AuthGate.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Auth Pages
import Auth from './pages/Auth.jsx';
import Login from './auth/Login.jsx';
import Signup from './auth/Signup.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Logout from './pages/Logout.jsx';

// Main Pages
import Home from './pages/Home.jsx';
import Agents from './pages/Agents.jsx';
import Specialists from './pages/Specialists.jsx';
import PlansScreen from './pages/PlansScreen.jsx';
import Pricing from './pages/Pricing.jsx';
import Subscribe from './pages/Subscribe.jsx';
import Subscription from './pages/Subscription.jsx';
import Success from './pages/Success.jsx';

// Chat & Specialist Pages
import Serginho from './pages/Serginho.jsx';
import Chat from './pages/Chat.jsx';
import SpecialistChat from './pages/SpecialistChat.jsx';
import BetinhoPage from './pages/BetinhoPage.jsx';
import HybridAgent from './pages/HybridAgent.jsx';
import HybridAgentSimple from './pages/HybridAgentSimple.jsx';

// Projects & Study
import Projects from './pages/Projects.jsx';
import StudyLab from './pages/StudyLab.jsx';
import Flashcards from './pages/Flashcards.jsx';
import GeradorResumos from './pages/GeradorResumos.jsx';
import MapasMentais from './pages/MapasMentais.jsx';
import Cronograma from './pages/Cronograma.jsx';

// Settings & Account
import Account from './pages/Account.jsx';
import Settings from './pages/Settings.jsx';
import AgentSettings from './pages/AgentSettings.jsx';

// Info & Legal Pages
import Help from './pages/Help.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Refund from './pages/Refund.jsx';
import Regulamento from './pages/Regulamento.jsx';
import Info from './pages/Info.jsx';
import AppInfo from './pages/AppInfo.jsx';

// Other Pages
import AgentDetail from './pages/AgentDetail.jsx';
import GitHubCallback from './pages/GitHubCallback.jsx';
import AutomationDashboard from './pages/AutomationDashboard.jsx';
import ComplianceTools from './pages/ComplianceTools.jsx';
import SourceProof from './pages/SourceProof.jsx';

const App = () => (
  <AuthProvider>
    <Header />
    <AuthGate>
      <Routes>
        {/* Public Routes - Auth */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Public Routes - Main */}
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/plans" element={<PlansScreen />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscribe" element={<Subscribe />} />

        {/* Public Routes - Info & Legal */}
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/regulamento" element={<Regulamento />} />
        <Route path="/info" element={<Info />} />
        <Route path="/app-info" element={<AppInfo />} />

        {/* Protected Routes - Chat & Specialists */}
        <Route path="/serginho" element={<Serginho />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:agentId" element={<Chat />} />
        <Route path="/specialist/:id" element={<SpecialistChat />} />
        <Route path="/betinho" element={<BetinhoPage />} />
        <Route path="/hybrid" element={<HybridAgent />} />
        <Route path="/hybrid-simple" element={<HybridAgentSimple />} />

        {/* Protected Routes - Projects & Study */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/study" element={<StudyLab />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/gerador-resumos" element={<GeradorResumos />} />
        <Route path="/mapas-mentais" element={<MapasMentais />} />
        <Route path="/cronograma" element={<Cronograma />} />

        {/* Protected Routes - Settings & Account */}
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/success" element={<Success />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/agent-settings" element={<AgentSettings />} />

        {/* Protected Routes - Other */}
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/github/callback" element={<GitHubCallback />} />
        <Route path="/automation" element={<AutomationDashboard />} />
        <Route path="/compliance" element={<ComplianceTools />} />
        <Route path="/source-proof" element={<SourceProof />} />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthGate>
    <Footer />
  </AuthProvider>
);

export default App;
