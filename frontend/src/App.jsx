import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage'
const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<StartPage />} />
      </Routes>
    </div>
  )
}

export default App