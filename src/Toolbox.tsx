// Toolbox.tsx
import React, { useContext } from 'react';
import './Toolbox.css';
import { AppContext } from './ContextProvider';

const Toolbox: React.FC = () => {
  const { selectedTool, setSelectedTool } = useContext(AppContext)!;

  const handleToolClick = (tool: string) => {
    setSelectedTool(selectedTool === tool ? null : tool);
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
      {/* Separate save button (no selection state) */}
      <button className="tool-button save-button">
        Save
      </button>
    </div>
  );
};

export default Toolbox;
