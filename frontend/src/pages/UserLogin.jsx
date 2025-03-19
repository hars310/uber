import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
      
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        toast.success('Login successful');
        setTimeout(() => navigate('/home'), 300);
        
        
        setEmail('');
        setPassword('');
      } else {
        toast.error('Invalid email or password');
      }

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Invalid email or password');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    }
  }

  return (
   <div className='w-full h-screen flex flex-col  justify-center items-center'>
     <div className='w-1/2 p-6'>
      <div>
        <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg border-none outline-none'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg border-none outline-none'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>

        </form>
        <p className='text-center'>New here? <Link to='/register' className='text-blue-600'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
   </div>
  )
}

export default UserLogin