
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProvider } from '@/contexts/AppContext'

createRoot(document.getElementById('root')!).render(<AppProvider />)