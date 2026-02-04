import RequireSubscription from './components/RequireSubscription.jsx';

// Other existing imports
import PlanGate from './components/PlanGate.jsx';

// Include RequireSubscription in protected routes
<Route path="/serginho" element={<RequireSubscription><Serginho /></RequireSubscription>} />
<Route path="/projects" element={<RequireSubscription><Projects /></RequireSubscription>} />
<Route path="/study" element={<RequireSubscription><StudyLab /></RequireSubscription>} />
<Route path="/specialists" element={<RequireSubscription><Specialists /></RequireSubscription>} />
<Route path="/specialist/:specialistId" element={<RequireSubscription><SpecialistChat /></RequireSubscription>} />
<Route path="/source-proof" element={<RequireSubscription><SourceProof /></RequireSubscription>} />
<Route path="/cronograma" element={<RequireSubscription><Cronograma /></RequireSubscription>} />
<Route path="/resumos" element={<RequireSubscription><GeradorResumos /></RequireSubscription>} />
<Route path="/flashcards" element={<RequireSubscription><Flashcards /></RequireSubscription>} />
<Route path="/mapas-mentais" element={<RequireSubscription><MapasMentais /></RequireSubscription>} />
<Route path="/hybrid" element={<RequireSubscription><HybridAgentSimple /></RequireSubscription>} />
<Route path="/agent" element={<RequireSubscription><HybridAgentSimple /></RequireSubscription>} />

// Unchanged routes
<Route path="/pricing" element={<Pricing />} />
<Route path="/help" element={<Help />} />
<Route path="/settings" element={<Settings />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/subscription" element={<Subscription />} />