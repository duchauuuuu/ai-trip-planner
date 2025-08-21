import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Trip } from "../page";
import { ArrowBigRightIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";
type Props = {
  trip: Trip;
};
const MyTripCardItem = ({ trip }: Props) => {
  const [destinationImage, setDestinationImage] = useState("/placeholder.jpg");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    trip?.tripDetail?.destination && GetDestinationImage();
  }, [trip]);

  const GetDestinationImage = async () => {
    setImageLoading(true);
    try {
      const result = await axios.post('/api/google-place-detail', {
        placeName: trip?.tripDetail?.destination,
        type: "place"
      });
      
      if (result.data?.places?.[0]?.photos?.[0]?.photoUri) {
        const imageUrl = result.data.places[0].photos[0].photoUri;
        setDestinationImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching destination image:', error);
      setDestinationImage("/placeholder.jpg");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <Link href={'/view-trip/'+trip?.tripId} className="p-5 shadow rounded-2xl">
      <div className="relative">
        <Image
          src={destinationImage}
          alt={trip?.tripDetail?.destination || trip.tripId}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-[270px]"
          onError={() => setDestinationImage("/placeholder.jpg")}
        />
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      <h2 className="flex gap-2 font-semibold text-xl mt-2">
        {trip?.tripDetail?.} <ArrowBigRightIcon />{" "}
        {trip?.tripDetail?.destination}
      </h2>
      <h2 className="mt-2 text-gray-500">
        {trip?.tripDetail?.duration} Trip with {trip?.tripDetail?.budget} Budget
      </h2>
    </Link>
  );
};

export default MyTripCardItem;
