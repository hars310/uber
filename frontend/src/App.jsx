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
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import YourAssignedDriver from './pages/YourAssignedDriver'
const App = () => {

  return (
    <div>
    <Toaster />
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/captain-home' element={<CaptainHome/>}/>
        <Route path='/register' element={<UserRegister />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/captain-register' element={<CaptainRegister />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/assigned-driver' element={<YourAssignedDriver/>} />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
           <Route path='/captain/logout'
          element={<CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
          } />
          
      </Routes>
    </div>
  )
}

export default App