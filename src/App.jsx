import BetinhoPage from './pages/BetinhoPage.jsx';

// ... existing imports

function App() {
    return (
        <RequireSubscription>
            {/* existing routes */}
            <Route path='/hybrid' component={HybridPage} />
            <Route path='/betinho' component={BetinhoPage} />
            {/* other routes */}
        </RequireSubscription>
    );
}

export default App;