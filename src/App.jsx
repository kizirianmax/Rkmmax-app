import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RequireSubscription from './components/RequireSubscription.jsx';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' component={PublicRoute} />
        <Route path='/pricing' component={PublicRoute} />
        <Route path='/help' component={PublicRoute} />
        <Route path='/settings' component={PublicRoute} />
        <Route path='/subscription' component={PublicRoute} />
        <Route path='/privacy' component={PublicRoute} />
        <Route path='/terms' component={PublicRoute} />
        <Route path='/refund' component={PublicRoute} />
        <Route path='/regulamento' component={PublicRoute} />

        <RequireSubscription>
          <Route path='/serginho' component={ProtectedRoute} />
          <Route path='/projects' component={ProtectedRoute} />
          <Route path='/study' component={ProtectedRoute} />
          <Route path='/specialists' component={ProtectedRoute} />
          <Route path='/specialist/:specialistId' component={ProtectedRoute} />
          <Route path='/source-proof' component={ProtectedRoute} />
          <Route path='/cronograma' component={ProtectedRoute} />
          <Route path='/resumos' component={ProtectedRoute} />
          <Route path='/flashcards' component={ProtectedRoute} />
          <Route path='/mapas-mentais' component={ProtectedRoute} />
          <Route path='/hybrid' component={ProtectedRoute} />

          <RequireSubscription>
            <Route path='/agents' component={ProtectedRoute} />
          </RequireSubscription>

        </RequireSubscription>
      </Switch>
    </Router>
  );
}

export default App;