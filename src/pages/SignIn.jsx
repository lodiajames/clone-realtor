
import { useState } from 'react'
import {AiFillEye} from "react-icons/ai"
import {AiFillEyeInvisible} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'

function SignIn() {
const [formData, setFormData] = useState({
    email: "",
    password: ""
})
const [showPassword, setShowPassword] = useState(false)

const {email, password} = formData
function onChange(e) {
  e.preventDefault()
  setFormData((prev)=>({
    ...prev, [e.target.id]: e.target.value,
  }))
  console.log(e.target.value);
} 

  return (
    <section>
        <h1 className='text-3xl text-center mt-6 font-bold'>Sign In </h1>
       <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto ">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
               <img className='w-full rounded-2xl' src="https://plus.unsplash.com/premium_photo-1661775023997-2383f2cb7e9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDN8fGtleXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" alt="login"  />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
               <form className=''>
                   <input type="email" id='email' value={email} placeholder='Email' onChange={onChange} 
                   className='w-full px-4 mb-6  py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' />
                    
                   <div className="relative mb-6">
                   <input type={showPassword ? "text" : "password"} id='password' value={password} placeholder='Password' onChange={onChange} 
                   className='w-full px-4  py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' />
                    {showPassword ? (
                      <AiFillEyeInvisible  className="absolute right-3 top-3 text-xl cursor-pointer" onClick={()=>setShowPassword(false)} /> 
                    ): (
                      <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword(true)} />
                    )}
                   </div>
                   <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                    <p className='mb-6'>Don't have an account
                      <Link to='/sign-up' className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Register</Link>
                      </p>

                    <p>
                      <Link to='/forgot-password' className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>Forgot password?</Link>
                      </p>
                   </div>

                   <button type='submit' className='w-full bg-blue-600 text-white px-7 py-4 
                       text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Sign in</button>
                      <div className="my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                        <p className='text-center font-semibold mx-4'>OR</p>
                      </div>
                      <OAuth />
               </form>
          </div>
       </div>
    </section>
  )
}

export default SignIn