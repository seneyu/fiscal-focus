import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './customTheme';
import App from './App';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
