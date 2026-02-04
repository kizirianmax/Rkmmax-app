'use strict';

import React from 'react';
import { Route } from 'react-router-dom';
import RequireSubscription from './RequireSubscription';
import BetinhoPage from './pages/BetinhoPage.jsx';

// existing routes ...

const App = () => (
  <div>
    <RequireSubscription>
      {/* existing route */}
      <Route path='/betinho' component={BetinhoPage} />
      <RequireSubscription forAgents>
        {/* nested routes for agents... */}
      </RequireSubscription>
    </RequireSubscription>
  </div>
);

export default App;