import { createRoot } from 'react-dom/client'
import { AppProvider } from './app/provider'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(<AppProvider />)