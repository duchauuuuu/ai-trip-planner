'use client'
import { useEffect, useState } from 'react'
import ChatBox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'
import { useTripDetail } from '../Provider';
import GlobalMap from './_components/GlobalMap';
import { Button } from '@/components/ui/button';
import { Globe, Globe2, Plane } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const CreateNewTrip = () => {
    const {tripDetailInfo,setTripDetailInfo} = useTripDetail();
    const[activeIndex,setActiveIndex] = useState(0);
    useEffect(()=>{
      setTripDetailInfo(null);
    },[])
  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-5 p-10 '>
        <div className='col-span-2'><ChatBox></ChatBox></div>
        <div className='col-span-3 relative'>
         {activeIndex === 0 ? <Itinerary></Itinerary> : <GlobalMap></GlobalMap> }
        <Tooltip>
  <TooltipTrigger  className='absolute  bottom-10 left-[50%] rounded-2xl'> 
    <Button
         onClick={()=>setActiveIndex(activeIndex===0?1:0)}
          size={'lg'} className='bg-black hover:bg-gray-700'> {activeIndex === 0 ? <Plane></Plane> : <Globe2></Globe2>}</Button>
 </TooltipTrigger>
  <TooltipContent>
 Switch Between Map and Trip      
  </TooltipContent>
</Tooltip>
          </div>
    </div>
  )
}

export default CreateNewTrip