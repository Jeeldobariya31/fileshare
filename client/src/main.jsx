import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'
import { HostProvider } from './context/HostContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SocketProvider>
          <HostProvider>
            <App />
          </HostProvider>
        </SocketProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
