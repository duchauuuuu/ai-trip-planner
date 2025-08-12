'use client'
import Itinerary from '@/app/create-new-trip/_components/Itinerary'
import { Trip } from '@/app/my-trips/page'
import { useTripDetail, useUserDetail } from '@/app/Provider'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ViewTrip = () => {
    const {tripid} = useParams()
    const {userDetail, setUserDetail} = useUserDetail();
    const convex = useConvex();
    const [tripData, setTripData] = useState<Trip>();
     const {tripDetailInfo,setTripDetailInfo} = useTripDetail();
    
    useEffect(()=>{
        userDetail && GetTrip();
    },[userDetail])
    const GetTrip = async () => {
        const result = await convex.query(api.tripDetail.GetTripById, {
            uid: userDetail?._id,
            tripid: tripid+''
        });
        setTripData(result);
        setTripDetailInfo(result?.tripDetail);
    } 
  return (
    <div><Itinerary/></div>
  )
}

export default ViewTrip