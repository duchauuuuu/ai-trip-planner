'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Hotel } from './ChatBox'
import { Star, Wallet } from 'lucide-react'
import axios from 'axios'
type Props = {
    hotel:Hotel
}
const HotelCardItem = ({hotel}:Props) => {
  const [hotelImage, setHotelImage] = useState("/placeholder.jpg");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(()=>{
    hotel && GetGooglePlaceDetail();
  },[hotel])
  const GetGooglePlaceDetail = async () =>{
    setImageLoading(true);
    try {
      const result = await axios.post('/api/google-place-detail',{
        placeName: hotel?.hotel_name,
        type: "hotel"
      });
      console.log('Unsplash API response:', result.data);
      
     
      if (result.data?.places?.[0]?.photos?.[0]?.photoUri) {
        const imageUrl = result.data.places[0].photos[0].photoUri;
        console.log('Hotel image URL:', imageUrl);
        setHotelImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      setHotelImage("/placeholder.jpg");
    } finally {
      setImageLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-1">
                  <div className="relative">
                    <Image
                      src={hotelImage}
                      alt={`${hotel?.hotel_name} - ảnh du lịch`}
                      width={400}
                      height={200}
                      className="rounded-xl shadow object-cover mb-2"
                      onError={() => setHotelImage("/placeholder.jpg")}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  <h2 className="font-semibold text-lg">{hotel?.hotel_name}</h2>
                  <h2 className="text-gray-500 ">{hotel?.hotel_address}</h2>
                  <div className="flex justify-between items-center">
                    <p className="flex gap-2 text-green-600"><Wallet/> {hotel?.price_per_night}</p>
                  <p className="text-yellow-500 flex gap-2"><Star/> {hotel?.rating}</p>
                    </div>
                       <Link href={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotel_name} target="_blank">
                         <Button variant={'outline'} className="mt-1 w-full">View</Button>
                       </Link>
                    {/* <p className="line-clamp-2 text-gray-500">{hotel?.description}</p>
                     */}
                    </div>
                  
  )
}

export default HotelCardItem