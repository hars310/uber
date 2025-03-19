
import React from 'react'
import { Link } from 'react-router-dom'

const StartPage = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'>
        <img className='w-16 ml-8' src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" alt="" />
        <div className='bg-white pb-4 py-2 px-4'>
          <h2 className='text-[30px] text-center font-semibold'>Get Started with Uber</h2>
          <div className='flex justify-center'>
          <Link to='/login' className='flex items-center justify-center w-1/2 bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPage