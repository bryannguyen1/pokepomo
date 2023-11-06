import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { TasksContextProvider } from './context/TasksContext';
import { CreditsContextProvider } from './context/CreditsContext';
import { CollectionContextProvider } from './context/CollectionContext';
import { BPContextProvider } from './context/BPContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <BPContextProvider>
        <CollectionContextProvider>
          <CreditsContextProvider>
            <TasksContextProvider>
              <App />
            </TasksContextProvider>
          </CreditsContextProvider>
        </CollectionContextProvider>
      </BPContextProvider>
    </AuthContextProvider>
  // </React.StrictMode>
);
