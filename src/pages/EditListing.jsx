import React, { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import {getAuth} from 'firebase/auth'
import {v4 as uuidv4} from 'uuid'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';



export default function EditListing() {
    const auth = getAuth()
    const navigate = useNavigate()
    const [geolocEnabled, setGeolocEnabled] = useState(true)
    const [loading, setLoading] = useState(false) 
    const [listing, setListing] = useState(false)   

    const [formData, setFormData]= useState({
        type: "rent",
        name: "",
        beds:1,
        bath:1,
        parking: false,
        furnished:false,
        address: "",
        description: "",
        offer: true,
        regularPrice:0,
        discountPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })
    
    const {type, name, beds, bath, parking, latitude, longitude, furnished, address, description, offer, regularPrice, images, discountPrice}=formData
    

    const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You are'n allowed to edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
   
    
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }
  
    let geolocation = {};
    let location;
    if (geolocEnabled) {
        setGeolocEnabled(true)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
          // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
        default:
            console.log('running')
    }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = doc(db, "listings", params.listingId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold capitalize'>Editing your  Listing ....</h1>
   
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold'>Sell or Rent</p>
            <div className=" flex">
                <button type='button' id="type" value="sale" onClick={onChange}
                className={`mr-3 px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "rent" ? "bg-white text-black": "bg-slate-600 text-white"
                }`}>SELL</button>

                <button type='button ml-3' id="type" value="rent" onClick={onChange}
                className={`px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "sale" ? "bg-white text-black": "bg-slate-600 text-white"
                }`}>RENT</button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type="text" id='name' value={name} onChange={onChange}
            className="w-full px-4 py-2 text-xl  text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6 " placeholder='Name' maxLength="32" minLength="10"  required/>
             <div className="flex space-x-6 mb-6">
                  <div>
                    <p className='text-lg font-semibold'>Beds</p>
                    <input className=' w-full px-4 py-2 text-xl text-gray-800 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id='beds' value={beds} onChange={onChange} min='1' max='50' required/>
                  </div>
                  <div>
                    <p className='text-lg font-semibold'>Baths</p>
                    <input className=' w-full px-4 py-2 text-xl text-gray-800 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' type="number" id='bath' value={bath} onChange={onChange} min='1' max='50' required/>
                  </div>
             </div>
             <p className='text-lg mt-6 font-semibold'>Parking place</p>
            <div className=" flex">
                <button type='button' id="parking" value={true} onClick={onChange}
                className={`mr-3 px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !parking ? "bg-white text-black": "bg-slate-600 text-white"
                }`}>YES</button>

                <button type='button ml-3' id="parking" value={false} onClick={onChange}
                className={`px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    parking ? "bg-white text-black": "bg-slate-600 text-white"
                }`}>NO</button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Furnished</p>
            <div className=" flex">
                <button type='button' id="furnished" value={true} onClick={onChange}
                className={`mr-3 px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                   !furnished? "bg-white text-black": "bg-slate-600 text-white"
                }`}>YES</button>

                <button type='button ml-3' id="furnished" value={false} onClick={onChange}
                className={`px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                   furnished? "bg-white text-black": "bg-slate-600 text-white"
                }`}>NO</button>
            </div>

            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type="text" id='address' value={address} onChange={onChange}
            className="w-full px-4 py-2 text-xl  text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6 " placeholder='Address'   required/>

            {!geolocEnabled && (
                <div className=" flex space-x-6 justify-start mb-6">
                    <div className="">
                        <p className='text-lg font-semibold'>Latitude</p>
                         <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="Number" name="latitude" id="latitude"  value={latitude} onChange={onChange}
                         min="-90" max="90" required/>
                    </div>
                    <div className="">
                        <p className='text-lg font-semibold'>Longitude</p>
                         <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="Number" name="longitude" id="longitude"  value={longitude} onChange={onChange} 
                         min='-180' max='180' required/>
                    </div>
                </div>
            )} 
       
            <p className='text-lg  font-semibold'>Description</p>
            <textarea type="text" id='description' value={description} onChange={onChange}
            className="w-full px-4 py-2 text-xl  text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6 " placeholder='Description'   required/>
            

            <p className='text-lg font-semibold'>Offer</p>
            <div className=" flex mb-6">
                <button type='button' id="offer" value={true} onClick={onChange}
                className={`mr-3 px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                   !offer? "bg-white text-black": "bg-slate-600 text-white"
                }`}>YES</button>

                <button type='button ml-3' id="offer" value={false} onClick={onChange}
                className={`px-7 py-3 font-medium text-sm shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                   offer? "bg-white text-black": "bg-slate-600 text-white"
                }`}>NO</button>
            </div>

            {/* regular price */}
            <div className=" flex items-center mb-6">
                <div className="">
                    <p className='text-lg font-semibold'>Regular Price</p>
                   
                     <div className="flex w-full justify-center items-center space-x-6">
                        <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="50000000" required
                          className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                        />
                           {type === 'rent' && (
                        <div className="">
                            <p className='text-md w-full whitespace-nowrap'>$/month</p>
                        </div>
                     )}
                     </div>
                  
                    
                </div>
            </div>
            {/* discount */}
            {offer && 
            <div className=" flex items-center mb-6">
                <div className="">
                    <p className='text-lg font-semibold'>Discounted Price</p>
                   
                     <div className="flex w-full justify-center items-center space-x-6">
                        <input type="number" id="discountPrice" value={discountPrice} onChange={onChange} min="50" max="50000000" required={offer}
                          className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                        />
                           {type === 'rent' && (
                        <div className="">
                            <p className='text-md w-full whitespace-nowrap'>$/month</p>
                        </div>
                     )}
                     </div>
                  
                    
                </div>
            </div>
                    }
       {/* images fields */} 

       <div className="mb-6">
        <p className='text-lg font-semibold'>Images</p>
        <p className='text-gray-600'>Your image will be 6 max </p>
        <input  className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded
        transition duration-150 ease-in-out focus:bg-white focus:border-slate-600" type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg,.psd"/>

       </div>
       <button className='w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium
       text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg 
       active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out' type='submit'> Edit listing</button>

        </form>
   
   
   
   
   
   
    </main>
  )
}