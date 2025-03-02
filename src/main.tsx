import { createRoot } from 'react-dom/client'
import { AppProvider } from './app/provider'
import './styles/globals.css'

// Ensure we're using the router-based app provider
createRoot(document.getElementById('root')!).render(<AppProvider />)