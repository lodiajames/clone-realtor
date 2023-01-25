import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";




export default function Home() {
// for offers listings
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
// for Rent listings 
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", 'rent'),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
// for Sale listings 
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", 'sale'),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
   
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
          {offerListings && offerListings.length > 0 && (
                 <div className="m-2 mb-6 ">
                  <h2 className="px-3 text-2xl mt-6 font-semibold">New Sale Listings</h2>
                    <Link to='/offers'>
                      <p className="px-3 text-sm text-blue-600 hover:text-blue-700 capitalize  hover:underline transition duration-700 ease-in-out">view all new listing</p> 

                    </Link>
                            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3">
                              {offerListings.map((listing)=>(
                                <ListingItem 
                                key={listing.id}
                                listing={listing.data}/>
                              ))}
                            </ul>
                 </div>
          )}
          {rentListings && rentListings.length > 0 && (
                 <div className="m-2 mb-6 ">
                  <h2 className="px-3 text-2xl mt-6 font-semibold">Rental Listings</h2>
                    <Link to='/catefory/rent'>
                      <p className="px-3 text-sm text-blue-600 hover:text-blue-700 capitalize  hover:underline transition duration-700 ease-in-out">view all rent listing</p> 

                    </Link>
                            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3">
                              {rentListings.map((listing)=>(
                                <ListingItem 
                                key={listing.id}
                                listing={listing.data}/>
                              ))}
                            </ul>
                 </div>
          )}
          {saleListings && saleListings.length > 0 && (
                 <div className="m-2 mb-6 ">
                  <h2 className="px-3 text-2xl mt-6 font-semibold">Sale Listings</h2>
                    <Link to='/catefory/rent'>
                      <p className="px-3 text-sm text-blue-600 hover:text-blue-700 capitalize  hover:underline transition duration-700 ease-in-out">view all sale listing</p> 

                    </Link>
                            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3">
                              {saleListings.map((listing)=>(
                                <ListingItem 
                                key={listing.id}
                                listing={listing.data}/>
                              ))}
                            </ul>
                 </div>
          )}
      </div>
          
           {/* bottom */}
           <div className="mt-6 mb-6 max-w-6xl mx-auto bg-[#F7f7f7] px-4 rounded-lg ">
             <div className="grid md:grid-cols-2">
             <div className="  pt-6 flex flex-col justify-center items-center mb-6">
                   <h2 className="mb-3 font-semibold  md:text-lg">Let's find the right selling option for you</h2>
                      <p className="mb-3">Get your home's value and see selling options</p>
                         <button className="bg-red-600 px-4 py-3 rounded-full text-white hover:bg-red-700 cursor-pointer transition duration-300 ease-in-out">Start exploring</button>
                </div>
                
                <img className="object-none md:object-cover" src="https://static.rdc.moveaws.com/images/sellerAwareness/seller-banner-tablet-landscape-2x.jpg" alt="" />
             </div>

                

           </div>



      
      </div>
  )
}
