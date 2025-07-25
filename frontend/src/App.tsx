import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrisonCellLayout from './components/PrisonCellLayout';
import { GameStateProvider } from './state/GameStateContext';

const App: React.FC = () => {
  return (
    <Router>
      <GameStateProvider>
      <div>
        <h1>Welcome to Echoes of You</h1>
        <Switch>
          <Route path="/" exact component={PrisonCellLayout} />
          {/* Add more routes here as needed */}
        </Switch>
      </div>
      </GameStateProvider>
    </Router>
  );
};

export default App;