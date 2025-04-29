import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import Login from './login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
