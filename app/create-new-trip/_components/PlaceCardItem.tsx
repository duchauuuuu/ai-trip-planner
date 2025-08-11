'use client'
import { Button } from '@/components/ui/button'
import { Clock, ExternalLink, Ticket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Activity } from './ChatBox'
import axios from 'axios'

type Props ={
    activity: Activity
}
const PlaceCardItem = ({ activity }: Props) => {
  const [placeImage, setPlaceImage] = useState("/placeholder.jpg");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    activity && GetPlaceImage();
  }, [activity]);

  const GetPlaceImage = async () => {
    setImageLoading(true);
    try {
      const result = await axios.post('api/google-place-detail', {
        placeName: activity?.place_name,
        type: "place"
      });
      
      if (result.data?.places?.[0]?.photos?.[0]?.photoUri) {
        const imageUrl = result.data.places[0].photos[0].photoUri;
        setPlaceImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching place image:', error);
      setPlaceImage("/placeholder.jpg");
    } finally {
      setImageLoading(false);
    }
  };

  return (
        <div>
                  <div className="relative">
                    <Image 
                      src={placeImage} 
                      width={400} 
                      height={200}
                      alt={`${activity.place_name} - ảnh địa điểm`}
                      className="object-cover rounded-xl"
                      onError={() => setPlaceImage("/placeholder.jpg")}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                   <h2 className="font-semibold text-lg line-clamp-1">{activity.place_name}</h2>
                   <p className="text-gray-500 line-clamp-2">{activity.place_details}</p>
                   <h2 className="flex gap-2 text-blue-500 line-clamp-1"><Ticket></Ticket> {activity?.ticket_pricing}</h2>
                   <p className="flex text-orange-400 gap-2 line-clamp-1"><Clock/> {activity?.best_time_to_visit}</p>
                  <Link href={'https://www.google.com/maps/search/?api=1&query='+activity?.place_name} target="_blank">
                  <Button size={'sm'} variant={'outline'} className="w-full mt-2">View <ExternalLink/></Button>
                  </Link>
                   </div>
  )
}

export default PlaceCardItem