import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserDataContext)
    const navigate= useNavigate()
    const token = localStorage.getItem('token')
    useEffect(()=>{
        if(!user || !token){
            navigate('/login')
        }
    },[user])
  return (
    <div>Home</div>
  )
}

export default Home