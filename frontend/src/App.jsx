import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import { Toaster } from "react-hot-toast";
import CaptainRegister from './pages/CaptainRegister'
import Captainlogin from './pages/CaptainLogin'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import Home from './pages/Home'
const App = () => {

  return (
    <div>
    <Toaster />
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/register' element={<UserRegister />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/captain-register' element={<CaptainRegister />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
      </Routes>
    </div>
  )
}

export default App