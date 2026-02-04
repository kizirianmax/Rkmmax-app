import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RequireSubscription from "./components/RequireSubscription.jsx";
import Serginho from './components/Serginho';
import Projects from './components/Projects';
import StudyLab from './components/StudyLab';
import PlanGate from './components/PlanGate';
import Specialists from './components/Specialists';
import SpecialistChat from './components/SpecialistChat';
import SourceProof from './components/SourceProof';
import Cronograma from './components/Cronograma';
import GeradorResumos from './components/GeradorResumos';
import Flashcards from './components/Flashcards';
import MapasMentais from './components/MapasMentais';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/serginho"><RequireSubscription><Serginho /></RequireSubscription></Route>
        <Route path="/projects"><RequireSubscription><Projects /></RequireSubscription></Route>
        <Route path="/study"><RequireSubscription><StudyLab /></RequireSubscription></Route>
        <Route path="/agents"><RequireSubscription><PlanGate /></RequireSubscription></Route>
        <Route path="/specialists"><RequireSubscription><Specialists /></RequireSubscription></Route>
        <Route path="/specialist/:specialistId"><RequireSubscription><SpecialistChat /></RequireSubscription></Route>
        <Route path="/source-proof"><RequireSubscription><SourceProof /></RequireSubscription></Route>
        <Route path="/cronograma"><RequireSubscription><Cronograma /></RequireSubscription></Route>
        <Route path="/resumos"><RequireSubscription><GeradorResumos /></RequireSubscription></Route>
        <Route path="/flashcards"><RequireSubscription><Flashcards /></RequireSubscription></Route>
        <Route path="/mapas-mentais"><RequireSubscription><MapasMentais /></RequireSubscription></Route>
        {/* Keep all other routes unchanged */}
      </Switch>
    </Router>
  );
};

export default App;