// App.tsx
import React, { useState } from 'react';
import './App.css';
import FloorPlanCanvas from './FloorPlanCanvas';
import Toolbox from './Toolbox'; // Import the Toolbox component

const App: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleToolSelect = (tool: string) => {
        setSelectedTool(tool);
    };

    return (
        <div className="App">
            <h1>Draw your floor plan</h1>
            <Toolbox onToolSelect={handleToolSelect} /> {/* Render the Toolbox */}
            <FloorPlanCanvas selectedTool={selectedTool} /> {/* Pass the selectedTool prop */}
        </div>
    );
};

export default App;
