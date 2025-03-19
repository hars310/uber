import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage'
import UserRegister from './pages/UserRegister'
import { Toaster } from "react-hot-toast";
const App = () => {

  return (
    <div>
    <Toaster />
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/register' element={<UserRegister />} />
      </Routes>
    </div>
  )
}

export default App