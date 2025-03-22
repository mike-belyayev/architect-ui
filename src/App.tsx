// App.tsx
import React, { useState } from 'react';
import './App.css';
import FloorPlanCanvas from './FloorPlanCanvas';
import Toolbox from './Toolbox';

const App: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleToolSelect = (tool: string | null) => {
        setSelectedTool(tool);
    };

    return (
        <div className="App">
            <h1>Draw your floor plan</h1>
            <Toolbox onToolSelect={handleToolSelect} selectedTool={selectedTool} />
            <FloorPlanCanvas selectedTool={selectedTool} />
        </div>
    );
};

export default App;
