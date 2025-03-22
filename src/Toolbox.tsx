// Toolbox.tsx (Sidebar Component)
import React from 'react';
import './Toolbox.css';

interface ToolboxProps {
    onToolSelect: (tool: string) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onToolSelect }) => {
    return (
        <div className="toolboxContainer">
            <button onClick={() => onToolSelect('line')}>Line</button>
            <button onClick={() => onToolSelect('rectangle')}>Rectangle</button>
            <button onClick={() => onToolSelect('circle')}>Circle</button>
            {/* Add more tools here */}
        </div>
    );
};

export default Toolbox;
