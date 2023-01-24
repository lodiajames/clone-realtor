import { getDoc , doc} from 'firebase/firestore'
import React, {useState} from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase'

export default function ContactLandLord({userRef, listing}) {
    const [landlord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(()=>{
       async function getLandLord(){
            const docRef= doc(db, "users", userRef)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
           setLandLord(docSnap.data())
            }
            else {
                toast.error("Landlord info not disponible")
            }
       }
       getLandLord()
    }, [userRef]);

    function onChange(e){
        setMessage(e.target.value)
    }

  return <>
  
   {landlord !==null &&(
     <div className="flex flex-col w-full">
       <p className=''> Contact {landlord.name} for {listing.name.toLowerCase()} </p> 

        <div className=" mt-3 mb-6">
             <textarea className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' id="message" value={message}  onChange={onChange} rows="2"></textarea>
             </div> 
             <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                <button className='px-7 py-3 mb-6 bg-blue-600 text-white text-sm uppercase rounded shadow-md hover:bg-blue-800 hover:shadow-lg focus:bg-blue-800 focus:shadow-lg 
                active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out w-full text-center '>Send Message</button>
             </a>
       
       </div>

   ) 
   
}
   
   </>
  
}
