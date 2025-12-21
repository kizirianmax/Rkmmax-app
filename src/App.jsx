// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { initSentry } from "./lib/sentry.js";
import { initAnalytics } from "./lib/analytics.js";


import Header from "./components/Header.jsx";
import BrandTitle from "./components/BrandTitle.jsx";
import PlanGate from "./components/PlanGate.jsx";

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

// Wrapper para esconder Footer em páginas de chat
function FooterWrapper() {
  const location = useLocation();
  // Não mostrar footer nas páginas de chat
  const hiddenPaths = ['/serginho', '/specialists', '/specialist/', '/hybrid', '/agent', '/chat', '/regulamento'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;
  return <Footer />;
}

// Wrapper para mostrar FeedbackButton em páginas principais
function FeedbackWrapper() {
  const location = useLocation();
  // Não mostrar feedback nas páginas de chat (já tem muito conteúdo)
  const hiddenPaths = ['/serginho', '/specialist/', '/hybrid', '/agent', '/chat'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;
  return <FeedbackButton />;
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  useEffect(() => {
    // Initialize observability tools
    initSentry();
    initAnalytics();

    // Verificar se deve mostrar onboarding
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <BrandTitle />
      <Header />
      
      {/* Onboarding para novos usuários */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      
      {/* Banner de cadastro opcional */}
      <OptionalSignupBanner />
      
      {/* Banner de consentimento GDPR/LGPD */}
      <ConsentBanner />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/serginho" element={<Serginho />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/study" element={<StudyLab />} />
        <Route path="/source-proof" element={<SourceProof />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/resumos" element={<GeradorResumos />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/mapas-mentais" element={<MapasMentais />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/specialist/:specialistId" element={<SpecialistChat />} />
        <Route path="/study-lab" element={<Navigate to="/study" replace />} />

        {/* Área Premium */}
        <Route
          path="/agents"
          element={
            <PlanGate requirePlan="premium">
              <AgentsPage />
            </PlanGate>
          }
        />

        {/* Planos */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/plans" element={<Navigate to="/pricing" replace />} />

        {/* Sucesso do Stripe */}
        <Route path="/success" element={<Success />} />

        {/* Help & Status */}
        <Route path="/help" element={<Help />} />
        <Route path="/status" element={<Help />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />

        {/* Subscription Management */}
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/assinatura" element={<Navigate to="/subscription" replace />} />
         {/* Sistema Híbrido */}
        <Route path="/hybrid" element={<HybridAgentSimple />} />
        <Route path="/agent" element={<HybridAgentSimple />} />
        <Route path="/github-callback" element={<GitHubCallback />} />

        {/* Políticas */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/regulamento" element={<Regulamento />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer - Não mostrar em páginas de chat */}
      <FooterWrapper />
      
      {/* Feedback Button - Mostrar em páginas principais */}
      <FeedbackWrapper />
    </BrowserRouter>
  );
}
