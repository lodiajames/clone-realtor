import React from 'react'
import spinner from "../assets/svg/spinner.svg"

export default function Spinner() {
  return (
     <div className="flex justify-center items-center  py-[20%]">
          <div className="">
             <img src={spinner}alt="loading" className='h-50 ' />
          </div>
     </div>
  )
}
