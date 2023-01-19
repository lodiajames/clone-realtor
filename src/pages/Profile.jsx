import { useState } from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';


function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName ,
    email: auth.currentUser.email
  })
  const {name, email} = formData
  function onLogout(){
    auth.signOut()
    navigate('/')
    
  }

  function onChange(e){
      setFormData((prev)=>({
        ...prev, [e.target.id]:e.target.value
      }))
  }

  async function onsubmit(){
      try {
        if(auth.currentUser.displayName !== name){
          // update name in firebase authentification
          await updateProfile(auth.currentUser, {
            displayName:name
          });

          //update name in firestore
          const docRef = doc(db, "users", auth.currentUser.uid)
           await updateDoc(docRef, {
            name,
           });
        }
        toast.success("Profile successfully updated")
        
      } catch (error) {
        toast.error("Updating profile details is not made")
      }
  }
  return (
            <>

               <section className='max-w-6xl mx-auto flex justify-center flex-col items-center'>
                 <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
                  <div className=" w-full md:w-[50%] mt-6 px-3 ">
                      <form >
                        <input className={`w-full px-4 mb-6 py-2 text-xl text-gray-700 bg-white border
                        border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} type="text" name="name" id="name" value={name} disabled={!changeDetail} onChange={onChange}/>

                        <input className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border
                        border-gray-300 rounded transition ease-in-out" type="email" name="email" id="email" value={email} disabled/>
                          <div className=" flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className='flex items-center mb-6'>Do You want to change your name?
                                <span className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer ml-1' onClick={()=>
                                {

                                changeDetail && onsubmit();
              
                                setChangeDetail((prev)=>!prev)}}>
                                
                                  {changeDetail ? "Apply change" : "Edit"}</span>
                            </p>
                            <p className='text-blue-600 hover:text--900 transition duration-200 ease-in-out cursor-pointer' onClick={onLogout}>Sign out</p>
                          </div>
                      </form>
                  </div>
               </section>
            </>
  )
}

export default Profile