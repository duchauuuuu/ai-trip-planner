'use client'
import { Timeline } from "@/components/ui/timeline";
import React, { useEffect, useState } from "react";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/Provider";
import { TripInfo } from "./ChatBox";
import Image from "next/image";
import { div } from "motion/react-client";
import { ArrowLeft } from "lucide-react";
// const TRIP_DATA = {
//   destination: "Beijing, China",
//   duration: "3 Days",
//   origin: "Tokyo, Japan",
//   budget: "Moderate: Keep cost on the average side",
//   group_size: "A Couple: 2 People",
//   hotels: [
//     {
//       hotel_name: "Grand Hyatt Beijing",
//       hotel_address:
//         "1 East Chang An Avenue, Dongcheng District, Beijing, China",
//       price_per_night: "$150",
//       hotel_image_url:
//         "https://www.hyatt.com/hd/1/en/hotel/beijing/china-grand-hyatt-beijing/pekgh/media/images/hero/pekgh-hero-01.jpg",
//       geo_coordinates: {
//         latitude: 39.915,
//         longitude: 116.412,
//       },
//       rating: 8.9,
//       description:
//         "A luxurious hotel located in the heart of Beijing, offering modern amenities and proximity to key attractions like the Forbidden City.",
//     },
//   ],
//   itinerary: [
//     {
//       day: 1,
//       day_plan: "Arrival and Explore Central Beijing",
//       best_time_to_visit_day: "Morning to Afternoon",
//       activities: [
//         {
//           place_name: "Forbidden City",
//           place_details:
//             "A historic palace complex that served as the home of Chinese emperors for over 500 years, now a museum.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Forbidden_City_Beijing_Shenwumen_Gate.jpg/800px-Forbidden_City_Beijing_Shenwumen_Gate.jpg",
//           geo_coordinates: {
//             latitude: 39.9167,
//             longitude: 116.3975,
//           },
//           place_address: "4 Jingshan Front St, Dongcheng, Beijing, China",
//           ticket_pricing: "$10 per person",
//           time_travel_each_location: "2 hours",
//           best_time_to_visit: "Early morning to avoid crowds",
//         },
//         {
//           place_name: "Tiananmen Square",
//           place_details:
//             "One of the largest city squares in the world, a significant historical and political site.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tiananmen_Square%2C_Beijing%2C_China_%282019%29_-_1.jpg/800px-Tiananmen_Square%2C_Beijing%2C_China_%282019%29_-_1.jpg",
//           geo_coordinates: {
//             latitude: 39.9042,
//             longitude: 116.3914,
//           },
//           place_address: "Dongcheng, Beijing, China",
//           ticket_pricing: "Free",
//           time_travel_each_location: "1 hour",
//           best_time_to_visit: "Morning",
//         },
//       ],
//     },
//     {
//       day: 2,
//       day_plan: "Visit the Great Wall",
//       best_time_to_visit_day: "Morning",
//       activities: [
//         {
//           place_name: "Mutianyu Great Wall",
//           place_details:
//             "A well-preserved section of the Great Wall, ideal for hiking with stunning views.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mutianyu_Great_Wall_2017.jpg/800px-Mutianyu_Great_Wall_2017.jpg",
//           geo_coordinates: {
//             latitude: 40.4319,
//             longitude: 116.5655,
//           },
//           place_address: "Huairou District, Beijing, China",
//           ticket_pricing: "$15 per person",
//           time_travel_each_location: "4 hours (including travel)",
//           best_time_to_visit: "Early morning",
//         },
//       ],
//     },
//     {
//       day: 3,
//       day_plan: "Cultural Exploration and Departure",
//       best_time_to_visit_day: "Morning to Afternoon",
//       activities: [
//         {
//           place_name: "Temple of Heaven",
//           place_details:
//             "A historic complex where emperors prayed for good harvests, known for its stunning architecture.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Temple_of_Heaven%2C_Beijing%2C_China.jpg/800px-Temple_of_Heaven%2C_Beijing%2C_China.jpg",
//           geo_coordinates: {
//             latitude: 39.8799,
//             longitude: 116.4047,
//           },
//           place_address: "Tiantan Road, Dongcheng, Beijing, China",
//           ticket_pricing: "$6 per person",
//           time_travel_each_location: "2 hours",
//           best_time_to_visit: "Early morning",
//         },
//       ],
//     },
    
//   ],
// };
const Itinerary = () => {
  // @ts-ignore 
  const {tripDetailInfo,setTripDetailInfo} = useTripDetail();
  const [tripData,setTripData] = useState<TripInfo | null>(null);
  useEffect(()=>{
    tripDetailInfo && setTripData(tripDetailInfo);
  },[tripDetailInfo])
  const data = tripData ? [
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripData?.hotels.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel}/>
          ))}
        </div>
      ),
    },
    ...tripData?.itinerary.map((dayData)=>( {
      title:`Day ${dayData?.day}`,
      content: (
        <div>
          <p>Best time :{dayData?.best_time_to_visit_day}</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {dayData?.activities.map((activity, index) => (
       <PlaceCardItem key={index} activity={activity}></PlaceCardItem>
          ))}
         </div>
        </div>
      )
   } ))
  ] : [];
  return (
    <div className="relative w-full h-[83vh] overflow-auto">
    {tripData ?  <Timeline data={data} tripData={tripData} />
    : 
    <div className="relative">
      <h2 className="flex gap-2 text-3xl text-white items-center absolute left-5 bottom-8"><ArrowLeft/> Getting to know you to build perfect trip here...</h2>

      <Image src={'/travel.png'} alt="travel" width={800} height={600}
    className="w-full h-[83vh] object-cover rounded-3xl"></Image>
      </div>
    }
    </div>
  );
};

export default Itinerary;
