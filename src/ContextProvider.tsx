// ContextProvider.tsx
import React, {
  createContext,
  useState,
  ReactNode
} from 'react';
import * as fabric from 'fabric'; // Import Fabric.js

interface AppContextProps {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  fabricCanvas: fabric.Canvas | null; // Add canvas state
  setFabricCanvas: (canvas: fabric.Canvas | null) => void; // Add setter
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children
}) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null); // Initialize canvas state

  return (<
    AppContext.Provider value={
      {
        selectedTool,
        setSelectedTool,
        fabricCanvas,
        setFabricCanvas
      }
    } > {
      children
    } </AppContext.Provider>
  );
};
