// Toolbox.tsx
import React, { useContext } from 'react';
import './Toolbox.css';
import { AppContext } from './ContextProvider';

const Toolbox: React.FC = () => {
  const { selectedTool, setSelectedTool, saveCanvas, loadCanvas } = useContext(AppContext)!;

  const handleToolClick = (tool: string) => {
    setSelectedTool(selectedTool === tool ? null : tool);
  };

  const handleSaveCanvas = () => {
    saveCanvas('4xgood@gmail.com', 'default');
  };
  
  const handleLoadCanvas = () => {
    loadCanvas('4xgood@gmail.com', 'default');
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
      <button onClick={() => handleSaveCanvas()} className="tool-button save-button">
        Save
      </button>
      <button onClick={() => handleLoadCanvas()} className="tool-button save-button">
        Load
      </button>
    </div>
  );
};

export default Toolbox;
