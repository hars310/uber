import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import { Toaster } from "react-hot-toast";
import CaptainRegister from './pages/CaptainRegister'
import Captainlogin from './pages/CaptainLogin'
const App = () => {

  return (
    <div>
    <Toaster />
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/register' element={<UserRegister />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/captain-register' element={<CaptainRegister />} />
        <Route path='/captain-login' element={<Captainlogin />} />
      </Routes>
    </div>
  )
}

export default App