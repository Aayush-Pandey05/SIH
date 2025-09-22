import { Suspense  } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import './i18n'; 
createRoot(document.getElementById('root')).render(
 
 <BrowserRouter> 
    <Suspense fallback={null}>

      <App />
    </Suspense>
 </BrowserRouter>
)
