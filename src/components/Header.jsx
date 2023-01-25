import { useEffect, useState } from "react"
import { useLocation, useNavigate} from "react-router"
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default function Header() {
  const [pageState, setPageState] = useState('Log in')
    const location = useLocation()
   const navigate = useNavigate()
   const auth = getAuth();
   useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
          if(user){
            setPageState("Profile")
          }else {
            setPageState("Log in")
          }
        })
   },[auth])



   const styleLinks= (route)=>{
      if(route === location.pathname){
        return true
      }
    }
  return (
          <div className="bg-white border-b shadow-sm sticky top-0 z-[20000000]">
              <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
                {/* logo */}
                     <div className="">
              
                          <img src="../realtor.png" alt="realtor logo" 
                          className=' cursor-pointer h-10' onClick={()=> navigate('/')}/>
                     </div>
                     {/* menu */}
                     <div className="">
                            <ul className='flex space-x-10'>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${styleLinks('/') && "text-black border-b-red-500"}` }   onClick={()=>navigate("/")} >Home</li>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${styleLinks('/offers') && "text-black border-b-red-500"  }` } onClick={()=>navigate("/offers")}>Offers</li>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(styleLinks('/sign-in') || styleLinks("/profile")) && "text-black border-b-red-500" }` }   onClick={()=>navigate("/profile")}>{pageState}</li>
                            </ul>
                     </div>
              </header>
          </div>
  )
}
