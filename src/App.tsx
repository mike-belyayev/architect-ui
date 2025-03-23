// App.tsx
import React, { useState } from 'react';
import './App.css';
import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-react';
import FloorPlanCanvas from './FloorPlanCanvas';
import Toolbox from './Toolbox';

const App: React.FC = () => {

    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleToolSelect = (tool: string | null) => {
        setSelectedTool(tool);
    };

    return (
            <div className="App">
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <SignedOut>

                    <SignInButton />
                </SignedOut>
                    <SignedIn>
                    <UserButton /> 
                    </SignedIn>
            </div>

            <h1>Draw your floor plan</h1>
            <Toolbox onToolSelect={handleToolSelect} selectedTool={selectedTool} />
            <FloorPlanCanvas selectedTool={selectedTool} />
            </div>
    );
};

export default App;
