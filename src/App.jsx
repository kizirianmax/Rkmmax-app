// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { initSentry } from "./lib/sentry.js";
import { initAnalytics } from "./lib/analytics.js";
import FeedbackButton from "./components/FeedbackButton.jsx";

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/serginho" element={<Serginho />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/study" element={<StudyLab />} />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Feedback Button removido - agora apenas na Home */}
    </BrowserRouter>
  );
}
