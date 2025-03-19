import React, { useContext, useEffect } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'

const CaptainHome = () => {
    const { captain } = useContext(CaptainDataContext)
    const navigate= useNavigate()
    const token = localStorage.getItem('token')
    useEffect(()=>{
        if(!captain || !token){
            navigate('/captain-login')
        }
    },[captain])
  return (
    <div>Captain Home</div>
  )
}

export default CaptainHome