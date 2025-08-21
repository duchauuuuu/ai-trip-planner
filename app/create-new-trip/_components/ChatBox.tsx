"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTripDetail, useUserDetail } from "@/app/Provider";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";
type Message = {
  role: string,
  content: string,
  ui?: string
};
export type  TripInfo ={
    budget: string,
    destination: string,
    duration: string,
    group_size: string,
    origin: string,
    hotels: Hotel[],
    itinerary:Itinerary[],
}
export type Hotel = {
       hotel_name: string,

        hotel_address: string,

        price_per_night: string,

        hotel_image_url: string,

        geo_coordinates: {

          latitude: number,

          longitude: number

        },

        rating: number,

        description: string

}
export type Activity = {
  place_name: string,
  place_details: string,
  place_image_url: string,
  geo_coordinates: {
    latitude: number,
    longitude: number
  },
  place_address: string,
  ticket_pricing: string,
  time_travel_each_location: string,
  best_time_to_visit: string
}
export type Itinerary = {
  day: number,
  day_plan: string,
  best_time_to_visit_day: string,
  activities: Activity[];
};
const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinal,setIsFinal] = useState<boolean>(false);
  const [tripDetail,setTripDetail] = useState<TripInfo>();
  const hasInitializedRef = useRef<boolean>(false);
  const {userDetail,setUserDetail} = useUserDetail();
  //@ts-ignore
  const {tripDetailInfo,setTripDetailInfo} = useTripDetail();
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const searchParams = useSearchParams();

 
  useEffect(() => {
    const inputFromHero = searchParams.get('input');
    if (inputFromHero && !hasInitializedRef.current) {
      const decodedInput = decodeURIComponent(inputFromHero);
      hasInitializedRef.current = true;
      console.log('Sending from Hero:', decodedInput);
      
      // Auto-send the message from Hero
      setTimeout(() => {
        sendMessageDirectly(decodedInput);
      }, 500);
    }
  }, [searchParams]);

  const sendMessageDirectly = async (inputText: string) => {
    if (!inputText?.trim() || loading) return;
    console.log('sendMessageDirectly called with:', inputText);
    setLoading(true);
    
    const newMsg: Message = {
      role: "user",
      content: inputText,
    };
    
    setMessages((prev: Message[]) => {
      console.log('Adding message from Hero:', newMsg.content);
      console.log('Previous messages count:', prev.length);
      return [...prev, newMsg];
    });

    try {
      const result = await axios.post("/api/aimodel", {
        messages: [...messages, newMsg],
        isFinal: isFinal,
      });
      console.log("trip", result.data);
      
      !isFinal && setMessages((prev:Message[])=>[...prev,{
        role: "assistant",
        content: result?.data?.resp,
        ui:result?.data?.ui
      }]);
      
      if(isFinal){
        setTripDetail(result?.data?.trip_plan);
        setTripDetailInfo(result?.data?.trip_plan);
        const tripId = uuidv4();
         await SaveTripDetail({
          tripDetail: result?.data?.trip_plan,
          tripId: tripId,
          uid: userDetail?._id,
        })
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    
    setLoading(false);
  };

  const onSendWithInput = async (inputText: string, clearInput: boolean = true) => {
    if (!inputText?.trim()) return;
    setLoading(true);
    
    const newMsg: Message = {
      role: "user",
      content: inputText,
    };
    
    if (clearInput) {
      setUserInput("");
    }
    
    setMessages((prev: Message[]) => [...prev, newMsg]);

    const result = await axios.post("/api/aimodel", {
      messages: [...messages, newMsg],
      isFinal: isFinal,
    });
    console.log("trip", result.data);
    
    !isFinal && setMessages((prev:Message[])=>[...prev,{
      role: "assistant",
      content: result?.data?.resp,
      ui:result?.data?.ui
    }]);
    if(isFinal){
      setTripDetail(result?.data?.trip_plan);
      setTripDetailInfo(result?.data?.trip_plan);
      const tripId = uuidv4();
       await SaveTripDetail({
        tripDetail: result?.data?.trip_plan,
        tripId: tripId,
        uid: userDetail?._id,
        
      })
    }
    
    setLoading(false);
  };

  const onSend = async () => {
    if (!userInput?.trim() || loading) return;
    await onSendWithInput(userInput, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  const RenderGenerativeUi = (ui: string) =>{
    if(ui==='budget'){
return <BudgetUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='groupSize'){
        return <GroupSizeUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='tripDuration'){
        return <SelectDaysUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='final'){
      return <FinalUi viewTrip={()=>console.log()}
      disable={!tripDetail} />
    }
    return null;
  } 
  useEffect(()=>{
    const lastMsg = messages[messages.length - 1];
    if(lastMsg?.ui=='final'){
      setIsFinal(true);
      setUserInput('OK, GREAT!')
     
    }
  },[messages])

  useEffect(()=>{
     if(isFinal && userInput){
      onSend();
     }
  },[isFinal])
  return (
    <div className="h-[85vh] flex flex-col border shadow rounded-2xl p-5">
      {messages?.length === 0 && <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v); onSend()}}/>}
      {/* display message */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg:Message, index)=>(
          msg.role === 'user' ? 
            <div className="flex justify-end mt-2" key={index}>
          <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
            {msg.content}
          </div>
        </div>
        :
        <div className="flex justify-start mt-2" key={index}>
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
            { msg.content}
            {RenderGenerativeUi(msg.ui??'')}
          </div>
        </div>
        ))}
      {loading && <div className="flex justify-start mt-2" >
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
           <Loader className="animate-spin"/>
          </div>
        </div>}
      </section>
      {/* user input */}
      <section>
        <div className="relative border rounded-2xl p-4">
          <Textarea
            placeholder="Start typing your message..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0
                shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            onKeyDown={handleKeyPress}
          ></Textarea>
          <Button
            size={"icon"}
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
