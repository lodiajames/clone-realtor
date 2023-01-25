
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import { db } from '../firebase'

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastlisting, setLastListing]= useState(null)
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  const params = useParams()

  useEffect(() => {
    async function fetchListings() { 
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
           const lastElement = querySnap.docs[querySnap.docs.length -1]
            setLastListing(lastElement)
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not retrieve listing");
      }
    }

    fetchListings();
  }, [params.categoryName]);


  async function fetchMoreOffers() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(2)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState)=>[...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>{params.categoryName === 'rent'? "Rent Listing": "Sale Listing"}</h1>
         {loading ?(
          <Spinner />
         ) : listings && listings.length > 0 ? (
                <>
                   <main>
                          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                              {listings.map((listing)=>(
                                 <ListingItem  key={listing.id} id={listing.id} listing={listing.data}/>
                              ))}
                          </ul>
                   </main>

                       {lastlisting && (
                        <div className="flex justify-center items-center mt-3 mb-6">
                          <button className='bg-blue-400 text-gray-100 p-4 border-none cursor-pointer rounded-sm uppercase  hover:bg-blue-500 transition duration-150 ease-in
                          ' onClick={fetchMoreOffers}>Load more</button>
                        </div>
                       )}
                </>
         ): (
            <p>No recents listing</p>
         )}
    </div>
  )
}

export default Category