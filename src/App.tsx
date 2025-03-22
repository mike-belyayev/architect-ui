import React from 'react';
import './App.css';  // Importing the CSS file
import FloorPlanCanvas from './FloorPlanCanvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Draw your floor plan</h1>
      <FloorPlanCanvas/>
    </div>
  );
};

export default App;
