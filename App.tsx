import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ViewState } from './types';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);

  const handleLogin = () => {
    setViewState(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setViewState(ViewState.LOGIN);
  };

  return (
    <div className="antialiased text-slate-100 selection:bg-purple-500 selection:text-white">
      {viewState === ViewState.LOGIN ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;