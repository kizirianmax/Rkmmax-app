// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { initSentry } from "./lib/sentry.js";
import { initAnalytics } from "./lib/analytics.js";

import Header from "./components/Header.jsx";
import BrandTitle from "./components/BrandTitle.jsx";
import PlanGate from "./components/PlanGate.jsx";
import RequireSubscription from "./components/RequireSubscription.jsx";

import Home from "./pages/Home.jsx";
import Serginho from "./pages/Serginho.jsx";
import AgentsPage from "./pages/Agents.jsx";
import Projects from "./pages/Projects.jsx";
import StudyLab from "./pages/StudyLab.jsx";
import Specialists from "./pages/Specialists.jsx";
import SpecialistChat from "./pages/SpecialistChat.jsx";
import Pricing from "./pages/Pricing.jsx";
import Help from "./pages/Help.jsx";
import Settings from "./pages/Settings.jsx";
import Success from "./pages/Success.jsx";
import Subscription from "./pages/Subscription.jsx";
import Onboarding from "./components/Onboarding.jsx";
import OptionalSignupBanner from "./components/OptionalSignupBanner.jsx";
import Footer from "./components/Footer.jsx";
import FeedbackButton from "./components/FeedbackButton.jsx";
import ConsentBanner from "./components/ConsentBanner.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Refund from "./pages/Refund.jsx";
import HybridAgent from "./pages/HybridAgent.jsx";
import HybridAgentSimple from "./pages/HybridAgentSimple.jsx";
import GitHubCallback from "./pages/GitHubCallback.jsx";
import SourceProof from "./pages/SourceProof.jsx";
import Cronograma from "./pages/Cronograma.jsx";
import GeradorResumos from "./pages/GeradorResumos.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import MapasMentais from "./pages/MapasMentais.jsx";
import Regulamento from "./pages/Regulamento.jsx";
import AutomationDashboard from "./pages/AutomationDashboard.jsx";
import ComplianceTools from "./pages/ComplianceTools.jsx";

// Wrapper para esconder Footer em páginas de chat
function FooterWrapper() {
  const location = useLocation();
  const hiddenPaths = ['/serginho', '/specialists', '/specialist/', '/hybrid', '/agent', '/chat', '/regulamento'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;
  return <Footer />;
}

// Wrapper para mostrar FeedbackButton apenas na Home
function FeedbackWrapper() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <FeedbackButton />;
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  useEffect(() => {
    initSentry();
    initAnalytics();

    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <BrandTitle />
      <Header />
      
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      
      <OptionalSignupBanner />
      <ConsentBanner />

      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 🔒 ROTAS PROTEGIDAS - Requerem assinatura ativa */}
        <Route path="/serginho" element={<RequireSubscription><Serginho /></RequireSubscription>} />
        <Route path="/projects" element={<RequireSubscription><Projects /></RequireSubscription>} />
        <Route path="/study" element={<RequireSubscription><StudyLab /></RequireSubscription>} />
        <Route path="/source-proof" element={<RequireSubscription><SourceProof /></RequireSubscription>} />
        <Route path="/cronograma" element={<RequireSubscription><Cronograma /></RequireSubscription>} />
        <Route path="/resumos" element={<RequireSubscription><GeradorResumos /></RequireSubscription>} />
        <Route path="/flashcards" element={<RequireSubscription><Flashcards /></RequireSubscription>} />
        <Route path="/mapas-mentais" element={<RequireSubscription><MapasMentais /></RequireSubscription>} />
        <Route path="/specialists" element={<RequireSubscription><Specialists /></RequireSubscription>} />
        <Route path="/specialist/:specialistId" element={<RequireSubscription><SpecialistChat /></RequireSubscription>} />
        <Route path="/study-lab" element={<Navigate to="/study" replace />} />
        <Route path="/hybrid" element={<RequireSubscription><HybridAgentSimple /></RequireSubscription>} />
        <Route path="/agent" element={<RequireSubscription><HybridAgentSimple /></RequireSubscription>} />

        {/* Área Premium - Requer plano premium + assinatura */}
        <Route
          path="/agents"
          element={
            <RequireSubscription>
              <PlanGate requirePlan="premium">
                <AgentsPage />
              </PlanGate>
            </RequireSubscription>
          }
        />

        {/* ✅ ROTAS PÚBLICAS - Sem proteção */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/plans" element={<Navigate to="/pricing" replace />} />
        <Route path="/success" element={<Success />} />
        <Route path="/help" element={<Help />} />
        <Route path="/status" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/assinatura" element={<Navigate to="/subscription" replace />} />
        <Route path="/github-callback" element={<GitHubCallback />} />
        <Route path="/automation" element={<AutomationDashboard />} />
        <Route path="/compliance" element={<ComplianceTools />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/regulamento" element={<Regulamento />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FooterWrapper />
      <FeedbackWrapper />
    </BrowserRouter>
  );
}