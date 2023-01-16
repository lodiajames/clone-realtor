import { useLocation, useNavigate} from "react-router"

export default function Header() {
    const location = useLocation()
   const navigate = useNavigate()

   const styleLinks= (route)=>{
      if(route === location.pathname){
        return true
      }
    }
  return (
          <div className="bg-white border-b shadow-sm sticky top-0 z-100">
              <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
                {/* logo */}
                     <div className="">
                          <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="realtor logo" 
                          className=' cursor-pointer h-5' onClick={()=> navigate('/')}/>
                     </div>
                     {/* menu */}
                     <div className="">
                            <ul className='flex space-x-10'>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${styleLinks('/') && "text-black border-b-red-500"}` }   onClick={()=>navigate("/")} >Home</li>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${styleLinks('/offers') && "text-black border-b-red-500"  }` } onClick={()=>navigate("/offers")}>Offers</li>
                                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${styleLinks('/sign-in') && "text-black border-b-red-500"  }` }   onClick={()=>navigate("/sign-in")}>Log in</li>
                            </ul>
                     </div>
              </header>
          </div>
  )
}
