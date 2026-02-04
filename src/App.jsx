'use strict';

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGate from './auth/AuthGate.jsx';
import RequireSubscription from './components/RequireSubscription.jsx';

// Page imports
import Home from './pages/Home.jsx';
import BetinhoPage from './pages/BetinhoPage.jsx';
import Agents from './pages/Agents.jsx';
import AgentDetail from './pages/AgentDetail.jsx';
import Specialists from './pages/Specialists.jsx';
import SpecialistChat from './pages/SpecialistChat.jsx';
import Chat from './pages/Chat.jsx';
import Serginho from './pages/Serginho.jsx';
import HybridAgent from './pages/HybridAgent.jsx';
import HybridAgentSimple from './pages/HybridAgentSimple.jsx';
import StudyLab from './pages/StudyLab.jsx';
import Flashcards from './pages/Flashcards.jsx';
import MapasMentais from './pages/MapasMentais.jsx';
import GeradorResumos from './pages/GeradorResumos.jsx';
import Cronograma from './pages/Cronograma.jsx';
import Projects from './pages/Projects.jsx';
import Plans from './pages/Plans.jsx';
import PlansScreen from './pages/PlansScreen.jsx';
import Pricing from './pages/Pricing.jsx';
import Subscription from './pages/Subscription.jsx';
import Subscribe from './pages/Subscribe.jsx';
import Success from './pages/Success.jsx';
import Account from './pages/Account.jsx';
import Settings from './pages/Settings.jsx';
import AgentSettings from './pages/AgentSettings.jsx';
import Auth from './pages/Auth.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import GitHubCallback from './pages/GitHubCallback.jsx';
import Logout from './pages/Logout.jsx';
import Help from './pages/Help.jsx';
import Info from './pages/Info.jsx';
import AppInfo from './pages/AppInfo.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Regulamento from './pages/Regulamento.jsx';
import Refund from './pages/Refund.jsx';
import AutomationDashboard from './pages/AutomationDashboard.jsx';
import ComplianceTools from './pages/ComplianceTools.jsx';
import SourceProof from './pages/SourceProof.jsx';

const App = () => (
  <AuthGate>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/regulamento" element={<Regulamento />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/info" element={<Info />} />
      <Route path="/app-info" element={<AppInfo />} />
      <Route path="/help" element={<Help />} />
      
      {/* Protected routes - require authentication */}
      <Route path="/logout" element={<Logout />} />
      <Route path="/account" element={<Account />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/plans-screen" element={<PlansScreen />} />
      <Route path="/success" element={<Success />} />
      
      {/* Protected routes - require subscription */}
      <Route 
        path="/betinho" 
        element={
          <RequireSubscription>
            <BetinhoPage />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/agents" 
        element={
          <RequireSubscription>
            <Agents />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/agents/:agentId" 
        element={
          <RequireSubscription>
            <AgentDetail />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/agents/:agentId/settings" 
        element={
          <RequireSubscription>
            <AgentSettings />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/specialists" 
        element={
          <RequireSubscription>
            <Specialists />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/specialist/:specialistId" 
        element={
          <RequireSubscription>
            <SpecialistChat />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/chat/:agentId" 
        element={
          <RequireSubscription>
            <Chat />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/serginho" 
        element={
          <RequireSubscription>
            <Serginho />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/hybrid" 
        element={
          <RequireSubscription>
            <HybridAgent />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/hybrid-simple" 
        element={
          <RequireSubscription>
            <HybridAgentSimple />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <RequireSubscription>
            <Projects />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/study" 
        element={
          <RequireSubscription>
            <StudyLab />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/flashcards" 
        element={
          <RequireSubscription>
            <Flashcards />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/mapas-mentais" 
        element={
          <RequireSubscription>
            <MapasMentais />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/gerador-resumos" 
        element={
          <RequireSubscription>
            <GeradorResumos />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/cronograma" 
        element={
          <RequireSubscription>
            <Cronograma />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/automation" 
        element={
          <RequireSubscription>
            <AutomationDashboard />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/compliance" 
        element={
          <RequireSubscription>
            <ComplianceTools />
          </RequireSubscription>
        } 
      />
      <Route 
        path="/source-proof" 
        element={
          <RequireSubscription>
            <SourceProof />
          </RequireSubscription>
        } 
      />
      
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthGate>
);

export default App;