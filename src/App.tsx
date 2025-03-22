import React from 'react';
import FloorPlanCanvas from './FloorPlanCanvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Draw your floor plan</h1>
      <FloorPlanCanvas width={800} height={600} />
    </div>
  );
};

export default App;
