import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ViewState } from './types';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);
  const [userName, setUserName] = useState<string>('Member'); // Set a default name

  const handleLogin = () => {
    // Skip USER_INFO and go straight to the Dashboard
    setViewState(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUserName('Member');
    setViewState(ViewState.LOGIN);
  };

  const renderView = () => {
    switch(viewState) {
      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} />;
      case ViewState.DASHBOARD:
        return <Dashboard userName={userName} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="antialiased text-slate-100 selection:bg-purple-500 selection:text-white">
      {renderView()}
    </div>
  );
}

export default App;