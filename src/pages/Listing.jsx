

import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import {FaShare}from 'react-icons/fa'
import {FiMapPin} from 'react-icons/fi'
import {FaBed} from 'react-icons/fa'
import {FaBath} from 'react-icons/fa'
import {FaParking} from 'react-icons/fa'
import {FaCouch} from 'react-icons/fa'
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";

import { getAuth } from "firebase/auth";
import ContactLandLord from "../components/ContactLandLord";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";


export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopy, setShareLinkCopy] = useState(false)
  const [contactLandLord, setContactLandLord] = useState(false)

  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        let listing=docSnap.data()
        console.log(listing);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="fixed top-[13%] right-[3%] itemtop-6 z-10 cursor-pointer bg-white border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
      onClick={()=>{navigator.clipboard.writeText(window.location.href)
      setShareLinkCopy(true)
      setTimeout(()=>{
        setShareLinkCopy(false)
      }, 2000)
      
      
      }}>
            <FaShare className="text-lg text-slate-500"/>
      </div>
      {shareLinkCopy && (
         <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-200 rounded-md bg-white z-10 p-2">Link Copied</p>
      )}
      
      <div className=" m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5]">
         <div className="w-full ">
             <p className="text-2xl font-bold mb-3 text-blue-900 ">{listing.name} - ${listing.offer ? listing.discountPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listing.type === "rent" ? " /month" : " " }</p>
              <p className="flex items-center mt-6 mb-3 font-semibold"><FiMapPin className="text-green-800 mr-1"/>{listing.address}</p>    
                <div className="flex justify-start items-center space-x-4 with-75%">
                        <p className="bg-yellow-300 w-full max-w-[200px] rounded-md p-1 text-green-800 text-center font-semibold shadow-sm ">{listing.type==="rent" ? "Rent" :"Sale"}</p>
                        {listing.offer && (
                           <p className="w-full max-w-[200px] bg-green-800 p-1 text-white text-center rounded-md font-semibold shadow-md">${listing.regularPrice - listing.discountPrice} discount</p>
                        )}
                </div>
                <p className="mt-3 mb-3"><span className="font-semibold">Description - </span> <span>{listing.description}</span></p>
       
                 <ul className=" mb-6 flex items-center space-x-2 sm:space-x-10 text-sm font-semibold">
                     <li className="flex items-center whitespace-nowrap"> <FaBed className="text-lg mr-1"/>{+listing.beds>1 ? `${listing.beds} Beds` : "1 Bed"}</li>
                     <li className="flex items-center whitespace-nowrap"> <FaBath className="text-lg mr-1"/>{+listing.bath>1 ? `${listing.bath} Baths` : "1 Bath"}</li>
                     <li className="flex items-center whitespace-nowrap"> <FaParking className="text-lg mr-1"/>{+listing.parking>1 ? `${listing.parking} Parking Available` : " No Parking"}</li>
                     <li className="flex items-center whitespace-nowrap"> <FaCouch className="text-lg mr-1"/>{+listing.furnished>1 ? `${listing.furnished} furnished` : " No Furnished"}</li>

                 </ul>
                   

                 {(listing.userRef !== auth.currentUser?.uid && !contactLandLord) &&(

                 <div className="mt-6" onClick={()=>setContactLandLord(true)}>
                  
                 <button className="px-7 py-3 rounded shadow-md hover:bg-blue-800 hover:shadow-lg bg-blue-600 text-white  font-medium text-sm uppercase cursor-pointer
                 focus:bg-blue-700 focus:shadow-lg w-full transition duration-150 ease-in-out ">Contact Landlord</button>
                 </div>
       
                 )}
                 {contactLandLord && (
                  <ContactLandLord  userRef={listing.userRef} listing={listing}/>
                 )}

                 
         </div>
         <div className=" w-full h-[200px] md:h-[400px] md:mt-0 md:ml-2 mt-6 z-10 overflow-x-hidden">
                <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}
                style={{height:"100%", width:"100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>
               {listing.address} <br /> 
              </Popup>
            </Marker>
          </MapContainer>,   

         </div>
      </div>
    
       
     
    </main>
  );
}
