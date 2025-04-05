import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import { AppContextProvider } from './ContextProvider';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
     <ClerkProvider publishableKey={clerkPubKey}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
     </ClerkProvider>
  </React.StrictMode>
);
