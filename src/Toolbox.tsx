// Toolbox.tsx (Sidebar Component)
import React from 'react';
import './Toolbox.css';

interface ToolboxProps {
    onToolSelect: (tool: string | null) => void;
    selectedTool: string | null;
}

const Toolbox: React.FC<ToolboxProps> = ({ onToolSelect, selectedTool }) => {
    const handleToolClick = (tool: string) => {
        onToolSelect(selectedTool === tool ? null : tool);
    };

    return (
        <div className="toolboxContainer">
            <button 
                onClick={() => handleToolClick('line')}
                className={`tool-button ${selectedTool === 'line' ? 'selected' : ''}`}
            >
                Line
            </button>
            <button 
                onClick={() => handleToolClick('rectangle')}
                className={`tool-button ${selectedTool === 'rectangle' ? 'selected' : ''}`}
            >
                Rectangle
            </button>
            <button 
                onClick={() => handleToolClick('circle')}
                className={`tool-button ${selectedTool === 'circle' ? 'selected' : ''}`}
            >
                Circle
            </button>
            {/* Add more tools here */}
        </div>
    );
};

export default Toolbox;
