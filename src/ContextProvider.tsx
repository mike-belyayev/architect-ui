// ContextProvider.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ selectedTool, setSelectedTool }}>
      {children}
    </AppContext.Provider>
  );
};
