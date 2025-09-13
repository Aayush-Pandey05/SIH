import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Home2 from './pages/Home2'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import GovSchemes from './pages/GovSchemes'
import About from './pages/About'
import RoofAIPage from './pages/RoofAIPage'
import Support from './pages/Support'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home/> }/>
        <Route path='/dashboard' element={ <Dashboard/> }/>
        <Route path='/home' element={<Home2/>}/>
        <Route path='/login' element={ <LoginPage/> }/>
        <Route path='/signup' element={ <SignUp/> }/>
        <Route path='/map-roof' element={ <RoofAIPage/> }/>
        <Route path='/support' element={ <Support/> }/>
        <Route path='/govschemes' element={ <GovSchemes/> }/>
        <Route path='/about' element={ <About/> }/>
        
      </Routes>
    
    </div>
  )
}

export default App


