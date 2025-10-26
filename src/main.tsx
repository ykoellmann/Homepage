import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import './i18n'; // Initialize i18n
import { ViewModeProvider } from './contexts/ViewModeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <ViewModeProvider>
              <App />
          </ViewModeProvider>
      </BrowserRouter>
  </StrictMode>,
)
