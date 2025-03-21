import React from 'react'

const StartPageQRPart = () => {
  return (
    <div>
        <div className="h-[60vh] bg-gray-100 p-12">
        <div className="px-20 mt-4 ">
        <p className="text-4xl font-bold">It’s easier in the apps</p>
        <div className="flex flex-row gap-8 mt-12">
        <div className="w-1/2 cursor-pointer bg-white p-4 flex flex-row">
         <div>
         <img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_188,w_188/v1690807720/assets/a5/9986ad-0d9f-4396-8539-389bce97f579/original/Final-Download-Uber-App.png" alt="" 
         className="w-[90%]"/>
         </div>
         
         <div className="p-10 flex flex-col justify-center">
          <p className="text-2xl font-bold">
            Download the Uber App
          </p>
          <p>
            Scan to download
          </p>
         </div>

         <div className="flex items-center">
         <i className="text-3xl ri-arrow-right-wide-fill"></i>
         </div>
        </div>

        <div className="w-1/2 cursor-pointer bg-white p-4 flex flex-row">
         <div>
         <img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_188,w_188/v1690807720/assets/a5/9986ad-0d9f-4396-8539-389bce97f579/original/Final-Download-Uber-App.png" alt="" 
         className="w-[90%]"/>
         </div>
         
         <div className="p-10 flex flex-col justify-center">
          <p className="text-2xl font-bold">
            Download the Driver App
          </p>
          <p>
            Scan to download
          </p>
         </div>

         <div className="flex items-center">
         <i className="text-3xl ri-arrow-right-wide-fill"></i>
         </div>
        </div>
        

        </div>
        </div>

      </div>
    </div>
  )
}

export default StartPageQRPart