import { useEffect, useState } from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { updateDoc, doc, collection, orderBy, getDocs,query, where } from 'firebase/firestore';
import {FcHome} from 'react-icons/fc'
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem.jsx';


function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false)
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true)
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

    useEffect(()=>{
       async function fetchUserListing(){

         const listingRef = collection(db, 'listings');
         const q = query(listingRef, where("useRef", "==", auth.currentUser.uid), orderBy("timestamp", 'desc'))
        
         const  querySnap =  await getDocs(q)
         let listings = [];
         querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data: doc.data()
          })
         });
         setListings(listings)
         setLoading(false)
       }

       fetchUserListing()
        
    },[auth.currentUser.uid])

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

                      <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text:sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-900'>
                        <Link to='/create-listing' className='flex justify-center items-center'>
                      <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>Sell or rent you home
                      </Link>
                      </button>
                  </div>
               </section>
                       {/* lsiting images section */}
                    
                  <div className="max-w-6xl px-3 mt-6 mx-auto">
                    {!loading && listings.length > 0 && (
                        <> 
                           <h2 className='text-2xl text-center font-semibold'>My Listing</h2>
                              <ul>
                              {listings.map((listing) => (
                                  <ListingItem
                                    key={listing.id}
                                    id={listing.id}
                                    listing={listing.data}/>
                                 ))}
                              </ul>
                           </>
                    )}
                  </div>
         
         
           </>
  )
}

export default Profile