import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MyContextProvider } from './MyContext';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </React.StrictMode>
);
