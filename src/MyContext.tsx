import React, { createContext, useState, ReactNode } from 'react';

interface MyContextProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export const MyContext = createContext<MyContextProps | undefined>(undefined);

interface MyContextProviderProps {
  children: ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <MyContext.Provider value={{ count, setCount }}>
      {children}
    </MyContext.Provider>
  );
};
